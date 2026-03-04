import { Composition } from "remotion";
import { PadronIntro } from "./PadronIntro";

export const RemotionRoot = () => {
    return (
        <Composition
            id="PadronIntro"
            component={PadronIntro}
            durationInFrames={270}
            fps={30}
            width={1280}
            height={720}
        />
    );
};
