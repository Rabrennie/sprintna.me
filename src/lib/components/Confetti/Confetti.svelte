<script lang="ts">
    import confetti from 'canvas-confetti';

    interface particleOpts {
        spread?: number;
        startVelocity?: number;
        decay?: number;
        scalar?: number;
    }

    const showConfetti = (element: HTMLElement) => {
        const count = 250;

        const boundingImage = element.getBoundingClientRect();

        const fire = (particleRatio: number, opts: particleOpts) => {
            confetti({
                ...opts,
                particleCount: Math.floor(count * particleRatio),
                origin: {
                    x: (boundingImage.x + boundingImage.width / 2) / window.innerWidth,
                    y: (boundingImage.y + boundingImage.height) / window.innerHeight
                }
            });
        };

        fire(0.25, {
            spread: 26,
            startVelocity: 55
        });
        fire(0.2, {
            spread: 60
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45
        });
    };

    let confettiElement: HTMLDivElement;
    $: fireOnLoad && confettiElement && showConfetti(confettiElement);

    export let fireOnLoad: boolean = false;
</script>

<div bind:this={confettiElement}>
    <slot />
</div>
