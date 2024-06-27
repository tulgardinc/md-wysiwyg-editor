import { getSelectedElement, gotoMark, markPosition } from "./script.js";

export async function turnToList() {
    const selectedDiv = await getSelectedElement();
    selectedDiv.classList.add("list-item");
    selectedDiv.setAttribute("data-indent", "1");
    selectedDiv.setAttribute("style", "margin-left: 30px");
    markPosition();
    const html = selectedDiv.innerHTML;
    selectedDiv.innerHTML = html.replace(/^-&nbsp;/, "");
    gotoMark();
}

export async function unindentList(selectedElement) {
    const indentLevel = Number.parseInt(
        selectedElement.getAttribute("data-indent")
    );
    if (indentLevel === 1) {
        selectedElement.classList.remove("list-item");
        selectedElement.attributes.removeNamedItem("data-indent");
        selectedElement.setAttribute("style", "");
    } else {
        selectedElement.setAttribute(
            "data-indent",
            (indentLevel - 1).toString()
        );
        selectedElement.setAttribute(
            "style",
            `margin-left: ${(indentLevel - 1) * 30}px`
        );
    }
}

export async function removeListLine(selectedElement) {
    selectedElement.classList.remove("list-item");
    selectedElement.attributes.removeNamedItem("data-indent");
    selectedElement.setAttribute("style", "");
}

export async function indentList(selectedElement) {
    const indentLevel = Number.parseInt(
        selectedElement.getAttribute("data-indent")
    );
    selectedElement.setAttribute("data-indent", (indentLevel + 1).toString());
    selectedElement.setAttribute(
        "style",
        `margin-left: ${(indentLevel + 1) * 30}px`
    );
}
