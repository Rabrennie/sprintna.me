import { Prisma, PrismaClient, type Room } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { RoomState } from '../../types/Room';
export const db = new PrismaClient();

function Rooms(prismaRoom: PrismaClient['room']) {
    return Object.assign(prismaRoom, {
        async findOrError<T extends Prisma.RoomFindFirstArgs>(
            linkId: string,
            userId: number,
            args?: Prisma.SelectSubset<T, Prisma.RoomFindFirstArgs>
        ) {
            const roomFind = {
                where: { linkId, team: { users: { some: { id: userId } } } },
                ...(args ?? {})
            } satisfies Prisma.RoomFindFirstArgs;

            const dbRoom = await prismaRoom.findFirst(roomFind);

            if (!dbRoom) {
                throw error(403, 'nope');
            }

            return dbRoom as Prisma.RoomGetPayload<T>;
        },

        async nextStep(room: Room) {
            const step =
                room.step === RoomState.SELECTING ? RoomState.ELIMINATING : RoomState.FINISHED;

            return await prismaRoom.update({ where: { id: room.id }, data: { step } });
        }
    });
}

export const rooms = Rooms(db.room);
