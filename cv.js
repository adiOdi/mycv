class CVentry {
  constructor(entry) {
    this.length = 1;
    this.yearTitle = entry.from;
    if (entry.to) {
      this.yearTitle += "-";
      this.yearTitle += entry.to;
      this.length = entry.to - entry.from + 1;
    }
    this.startYear = entry.from;
    this.start = this.startYear - 2003;
    this.end = this.start + this.length;
    this.link = entry.link;
    this.name = entry.name;
    this.category = entry.category;
    this.layer = 0;
  }
  htmlify() {
    this.entry = document.createElement("a");
    this.entry.href = this.link;
    this.entry.style.width = this.length * CV.scale + "em";
    this.entry.style.left = this.start * CV.scale + "em";
    this.entry.style.top = this.layer * 5 + 2.5 + "em";
    const text = document.createElement("p");
    text.innerText = this.name;
    this.entry.dataset.title = this.yearTitle;
    this.entry.dataset.category = this.category;
    this.entry.className = "CVentry";
    this.entry.appendChild(text);
    return this.entry;
  }
}
class CV {
  static scale = 4;
  constructor(data) {
    this.entries = [];
    for (const key in data) {
      const entry = data[key];
      this.entries.push(new CVentry(entry));
    }
    bubbleSort(this.entries, this.entries.length);
    arrange(this.entries);
  }
  htmlify() {
    const html = document.createElement("div");
    for (const entry in this.entries) {
      html.appendChild(this.entries.at(entry).htmlify());
    }
    return html;
  }
}
function arrange(entries) {
  let slots = [];

  for (const entry in entries) {
    const element = entries[entry];
    let success = false;

    for (const slot in slots) {
      const slotLength = slots[slot];
      if (slotLength < element.start && !success) {
        slots[slot] = element.end;
        element.layer = slot;
        success = true;
      }
    }
    if (!success) {
      element.layer = slots.length;
      slots.push(element.end);
    }
  }
}
function bubbleSort(arr, n) {
  var i, j, temp;
  var swapped;
  for (i = 0; i < n - 1; i++) {
    swapped = false;
    for (j = 0; j < n - i - 1; j++) {
      if (arr[j].start > arr[j + 1].start) {
        // Swap arr[j] and arr[j+1]
        temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }

    // IF no two elements were
    // swapped by inner loop, then break
    if (swapped == false) break;
  }
}
