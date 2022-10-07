import debounce from "lodash.debounce";
import React from "react";

import styles from "./subtitle-input-overlay.module.scss";

interface SubtitleInputOverlayProps {
  showSubtitleInput?: boolean;
  onChange: (value: string) => void;
}

const SubtitleInputOverlay = React.forwardRef<
  HTMLInputElement,
  SubtitleInputOverlayProps
>(({ showSubtitleInput, onChange }, ref) => {
  const debounceChangeSubtitle = React.useMemo(
    () => debounce(onChange, 300),
    [onChange]
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounceChangeSubtitle(e.target.value);
    },
    [debounceChangeSubtitle]
  );

  return (
    <div
      className={styles.input_outer}
      style={{ display: showSubtitleInput ? "block" : "none" }}
    >
      <input ref={ref} onChange={handleChange} placeholder="Add subtile" />
    </div>
  );
});

export default SubtitleInputOverlay;
