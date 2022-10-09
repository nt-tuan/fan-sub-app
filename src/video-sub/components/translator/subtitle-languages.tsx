import LangSelect from "@/components/lang-select";
import { ArrowRightOutlined } from "@ant-design/icons";

import { useSubtitleLanguages } from "../../provider";
import styles from "./styles.module.scss";

export const SubtitleLanguages = () => {
  const { srcLang, setSrcLang, dstLang, setDstLang } = useSubtitleLanguages();
  return (
    <div className={styles.subtitle_lang_select_group}>
      <div className={styles.subtitle_lang_input}>
        <LangSelect
          availableLangs={["en"]}
          onChange={setSrcLang}
          value={srcLang ?? ""}
        />
      </div>
      <div>
        <div className={styles.subtitle_lang_direction_icon}>
          <ArrowRightOutlined />
        </div>
      </div>
      <div className={styles.subtitle_lang_input}>
        <LangSelect
          availableLangs={["vi", "en"]}
          onChange={setDstLang}
          value={dstLang ?? ""}
        />
      </div>
    </div>
  );
};
