import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const slides = [
    {
        eyebrow: "Padron IA",
        title: "Automatizacion para PYMEs",
        body: "Ahorra tiempo, reduce costes y vende mas con sistemas enfocados en resultados."
    },
    {
        eyebrow: "Ventas y Operaciones",
        title: "Procesos mas rapidos",
        body: "Unificamos captacion, seguimiento y soporte para eliminar friccion operativa."
    },
    {
        eyebrow: "Diagnostico Inicial",
        title: "Consultoria con impacto",
        body: "Definimos prioridades por fases para escalar con control y claridad."
    }
];

const palette = {
    deep: "#431844",
    plum: "#7D255B",
    light: "#965972",
    white: "#FEFEFE"
};

const Slide = ({ eyebrow, title, body, index }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        fps,
        frame,
        config: { damping: 200, stiffness: 130 }
    });

    const moveY = interpolate(entrance, [0, 1], [34, 0]);
    const fade = interpolate(frame, [0, 20, 60], [0, 1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp"
    });

    const orbShift = interpolate(frame, [0, 90], [0, 26], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp"
    });

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(145deg, ${palette.deep} 0%, ${palette.plum} 52%, ${palette.light} 100%)`,
                color: palette.white,
                overflow: "hidden"
            }}
        >
            <AbsoluteFill
                style={{
                    background:
                        "radial-gradient(circle at 14% 18%, rgba(255,255,255,0.16), transparent 38%), radial-gradient(circle at 86% 84%, rgba(255,255,255,0.12), transparent 42%)"
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: 360,
                    height: 360,
                    borderRadius: 999,
                    filter: "blur(70px)",
                    background: "rgba(254,254,254,0.25)",
                    left: 100 + index * 120,
                    top: 80 + orbShift
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0 110px",
                    transform: `translateY(${moveY}px)`,
                    opacity: fade
                }}
            >
                <p style={{ fontSize: 26, letterSpacing: 3, textTransform: "uppercase", margin: 0, opacity: 0.9 }}>{eyebrow}</p>
                <h1 style={{ margin: "22px 0 0", fontSize: 86, lineHeight: 1, maxWidth: 980 }}>{title}</h1>
                <p style={{ marginTop: 26, fontSize: 38, lineHeight: 1.25, maxWidth: 980, opacity: 0.95 }}>{body}</p>
            </div>
        </AbsoluteFill>
    );
};

export const PadronIntro = () => {
    return (
        <AbsoluteFill>
            <Sequence from={0} durationInFrames={90}>
                <Slide index={0} {...slides[0]} />
            </Sequence>
            <Sequence from={90} durationInFrames={90}>
                <Slide index={1} {...slides[1]} />
            </Sequence>
            <Sequence from={180} durationInFrames={90}>
                <Slide index={2} {...slides[2]} />
            </Sequence>
        </AbsoluteFill>
    );
};
