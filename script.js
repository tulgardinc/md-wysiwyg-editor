import {
    unindentList,
    turnToList,
    indentList,
    removeListLine,
} from "./ListFunction.js";

/**
 * gets the current active div representing a line in the editor
 * @returns {Promise<Element>} div
 */
export async function getSelectedElement() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const node = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE) {
            return node.parentNode;
        }
        return node;
    }
}

export function markPosition() {
    const marker = document.getElementById("marker");
    if (marker) {
        marker.parentElement.removeChild(marker);
    }
    const range = window.getSelection().getRangeAt(0);
    const newMarker = document.createElement("span");
    newMarker.id = "marker";
    newMarker.setAttribute("style", "display: none");
    range.insertNode(newMarker);
}

export function gotoMark() {
    const marker = document.getElementById("marker");
    const newRange = document.createRange();
    newRange.setStartAfter(marker);
    newRange.collapse(true);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(newRange);
    marker.parentElement.removeChild(marker);
}

/**
 * Handle events after key has been pressed but before text has been added
 * @param {KeyboardEvent} e
 * @returns {Promise}
 */
async function handleKeydown(e) {
    const selectedElement = await getSelectedElement();
    if (e.code === "Tab") {
        if (!selectedElement.classList.contains("list-item")) return;
        e.preventDefault();
        if (e.shiftKey) {
            unindentList(selectedElement);
        } else {
            indentList(selectedElement);
        }
    }
    if (e.code === "Backspace") {
        if (!selectedElement.classList.contains("list-item")) return;
        if (selectedElement.textContent.length > 1) return;
        e.preventDefault();
        unindentList(selectedElement);
    }
    if (e.code === "Enter") {
        if (!selectedElement.classList.contains("list-item")) return;
        if (selectedElement.textContent !== "") return;
        e.preventDefault();
        removeListLine(selectedElement);
    }
}

/**
 * Handle events after text has been added
 * @param {InputEvent} e
 * @returns {Promise}
 */
async function handleInput(e) {
    // add wrapper if deleted
    const selectedEl = await getSelectedElement();
    if (selectedEl.id === "text-editor") {
        markPosition();
        const newContent = selectedEl.innerHTML;
        selectedEl.innerHTML = "";
        const newLine = document.createElement("div");
        newLine.innerHTML = newContent;
        selectedEl.appendChild(newLine);
        gotoMark();
    }
    if (e.data === " ") {
        // handle inputs
        const split = selectedEl.textContent.split(/[\u0020\u00A0]/);
        if (split[0] === "-") {
            turnToList();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const editorElement = document.getElementById("text-editor");
    editorElement.addEventListener("input", (e) => handleInput(e));
    editorElement.addEventListener("keydown", (e) => handleKeydown(e));
    console.log(editorElement);
});
