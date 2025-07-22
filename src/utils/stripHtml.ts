//src/utils/stripHtml.ts
export function stripHtml(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
  