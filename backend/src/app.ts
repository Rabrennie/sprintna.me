import glob from 'glob'
import Server from './networking/Server';
import { config } from 'dotenv';

config();

const globby = async(path: string): Promise<Array<string>> => {
    return new Promise((resolve) => {
        glob(path, (err, res) => {
            resolve(res);
        });
    });
}

const setup = async () => {
    const paths = await globby(__dirname + '/networking/eventHandlers/**/*.js');

    await Promise.all(
        paths.map((file) => {
            return import(file.replace(__dirname, '.').replace('.js', ''));
        }),
    );

    const server = new Server(4321);
    server.start()
};

setup();
