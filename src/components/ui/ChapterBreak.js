import React from "react";

/**
 * A breathing space between sections where the 3D form takes centre stage.
 * Reads like a terminal: a real command types itself, then its output appears.
 */
function ChapterBreak({ command, output }) {
  return (
    <div className="chapter-break" aria-hidden="true">
      <div className="chapter-caption reveal" style={{ "--n": command.length }}>
        <span className="chapter-cmd">
          <span className="chapter-prompt">$</span>
          <span className="chapter-cmd-text">{command}</span>
          <span className="chapter-caret" />
        </span>
        <span className="chapter-output">{output}</span>
      </div>
    </div>
  );
}

export default ChapterBreak;
