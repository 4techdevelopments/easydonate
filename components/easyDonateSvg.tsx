import * as React from "react";
import { useEffect, useState } from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const Mao = (props: SvgProps) => (
    <Path
        stroke="#000"
        strokeWidth={5}
        fill="none"
        d="m54.275 228.108 23.4 52.9s1.559 3.082 11.19-2.034c0 0 16.869-11.633 41.709-5.087 0 0 34.56 13.213 51.882 16.277 0 0 12.876 5.226 36.623-10.173 0 0 15.6-7.667 30.519-15.26 12.917-6.576 25.432-14.242 25.432-14.242a60.483 60.483 0 0 0 14.242-20.346s14.375-19.851 15.26-21.363c0 0 7.615-21.641-20.346-15.259 0 0-37.1 26.889-42.727 34.588 0 0-.873 1.417 1.018 4.069 0 0 5.108 15.361-14.242 21.363 0 0-17.49 2.923-35.606-2.034 0 0-26.379-8.217-43.743 0 0 0-6.72-2.723 2.034-8.139 0 0 10.35-6 22.381-2.034 0 0 20.4 6.668 40.691 7.121 0 0 14.941 2.132 20.346-5.087 0 0 7.26-7.538-4.069-15.259 0 0-22.948-5.365-41.709-7.121 0 0-26.332-9.765-39.674-15.26 0 0-34.3-12.809-56.97 0l-37.641 22.38Z"
        {...props}
    />
);

export const Coracao = (props: SvgProps) => (
    <Path
        stroke="#FC7100"
        strokeWidth={6}
        fill="none"
        d="M191.61 206.745s-58.6-37.127-74.263-75.28c0 0-16.921-48.334 30.519-62.055 0 0 32.246-7.479 43.744 26.45 0 0 13.587-31.678 42.726-26.45 0 0 45.04 3.684 31.536 63.072 0 0-11.749 38.874-74.262 74.263Z"
        {...props}
    />
);

const EasyDonateSvg = (props: SvgProps & { children?: React.ReactNode }) => {
    const [maoOffset, setMaoOffset] = useState(1000);
    const [coracaoOffset, setCoracaoOffset] = useState(1000);

    useEffect(() => {
        let maoAnimationFrame: number;
        let coracaoAnimationFrame: number;

        const animateMao = () => {
            setMaoOffset((prevOffset) => (prevOffset <= 0 ? 1000 : prevOffset - 2)); // Ajuste da velocidade
            maoAnimationFrame = requestAnimationFrame(animateMao);
        };

        const animateCoracao = () => {
            setCoracaoOffset((prevOffset) => (prevOffset <= 0 ? 1000 : prevOffset - 2)); // Ajuste da velocidade
            coracaoAnimationFrame = requestAnimationFrame(animateCoracao);
        };

        maoAnimationFrame = requestAnimationFrame(animateMao);
        coracaoAnimationFrame = requestAnimationFrame(animateCoracao);

        return () => {
            cancelAnimationFrame(maoAnimationFrame);
            cancelAnimationFrame(coracaoAnimationFrame);
        };
    }, []);

    return (
        <Svg
            width={120}
            height={120}
            fill="none"
            viewBox="0 0 360 360"
            {...props}
        >
            <Mao strokeDasharray="1000" strokeDashoffset={maoOffset} />
            <Coracao strokeDasharray="1000" strokeDashoffset={coracaoOffset} />
        </Svg>
    );
};

export default EasyDonateSvg;