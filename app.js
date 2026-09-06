const DB_NAME = "wardrobe-pwa-db";
const DB_VERSION = 1;
const FALLBACK_STORAGE_KEY = "wardrobe-pwa-fallback-state";

const sampleImages = {
  suit: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  denim: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  knit: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
  coat: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80",
  closetA: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
  closetB: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
  closetC: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  closetD: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80"
};

const demoData = {
  closetItems: [
    {
      id: "item-1",
      name: "灰色西装外套",
      image: sampleImages.closetA,
      type: "外套",
      piece: "西装外套",
      mainColor: "灰",
      seasons: ["春", "秋"],
      styles: ["通勤", "极简"],
      status: "已拥有",
      notes: "适合办公室和正式一点的日常场景。",
      createdAt: 4
    },
    {
      id: "item-2",
      name: "黑色直筒裤",
      image: sampleImages.closetB,
      type: "裤子",
      piece: "直筒裤",
      mainColor: "黑",
      seasons: ["春", "秋", "冬"],
      styles: ["通勤", "休闲"],
      status: "已拥有",
      notes: "高腰，适合搭短上衣或西装。",
      createdAt: 3
    },
    {
      id: "item-3",
      name: "白色运动鞋",
      image: sampleImages.closetC,
      type: "鞋",
      piece: "运动鞋",
      mainColor: "白",
      seasons: ["春", "夏", "秋"],
      styles: ["休闲", "韩系"],
      status: "已拥有",
      notes: "适合降低正式感。",
      createdAt: 2
    },
    {
      id: "item-4",
      name: "黑色托特包",
      image: sampleImages.closetD,
      type: "包",
      piece: "托特包",
      mainColor: "黑",
      seasons: ["四季"],
      styles: ["通勤", "极简"],
      status: "已拥有",
      notes: "容量大，适合上班。",
      createdAt: 1
    }
  ],
  outfits: [
    {
      id: "outfit-1",
      title: "灰色西装通勤穿搭",
      image: sampleImages.suit,
      styles: ["通勤", "极简"],
      seasons: ["秋"],
      mainColor: "灰",
      pieces: ["西装外套", "直筒裤", "托特包"],
      occasions: ["上班", "日常"],
      replicaStatus: "可复刻",
      linkedItemIds: ["item-1", "item-2", "item-4"],
      notes: "灰黑组合利落，适合工作日。",
      createdAt: 4
    },
    {
      id: "outfit-2",
      title: "牛仔衬衫周末搭配",
      image: sampleImages.denim,
      styles: ["休闲", "美式复古"],
      seasons: ["春", "秋"],
      mainColor: "蓝",
      pieces: ["牛仔衬衫", "直筒裤", "运动鞋"],
      occasions: ["日常", "旅行"],
      replicaStatus: "缺少单品",
      linkedItemIds: ["item-2", "item-3"],
      notes: "需要补一件类似的牛仔衬衫。",
      createdAt: 3
    },
    {
      id: "outfit-3",
      title: "白色针织温柔约会感",
      image: sampleImages.knit,
      styles: ["韩系", "温柔"],
      seasons: ["春", "秋"],
      mainColor: "白",
      pieces: ["针织衫", "半裙", "单肩包"],
      occasions: ["约会", "日常"],
      replicaStatus: "仅作灵感",
      linkedItemIds: [],
      notes: "喜欢柔和轮廓，后续可以找类似针织衫。",
      createdAt: 2
    },
    {
      id: "outfit-4",
      title: "冬季黑色大衣搭配",
      image: sampleImages.coat,
      styles: ["通勤", "法式"],
      seasons: ["冬"],
      mainColor: "黑",
      pieces: ["大衣", "靴子", "托特包"],
      occasions: ["上班", "聚会"],
      replicaStatus: "缺少单品",
      linkedItemIds: ["item-4"],
      notes: "缺一件合身黑大衣和短靴。",
      createdAt: 1
    }
  ]
};

let db;
let state = { closetItems: [], outfits: [] };
let currentView = "outfits";
let editingOutfitId = null;
let editingItemId = null;

const defaultTags = {
  styles: ["通勤", "韩系", "法式", "休闲", "甜酷", "极简", "美式复古", "温柔"],
  seasons: ["春", "夏", "秋", "冬", "四季"],
  mainColor: ["黑", "白", "灰", "米", "棕", "蓝", "红", "粉", "绿", "黄"],
  pieces: ["西装外套", "衬衫", "针织衫", "半裙", "直筒裤", "牛仔衬衫", "运动鞋", "托特包", "大衣", "靴子", "单肩包"],
  occasions: ["上班", "日常", "约会", "旅行", "聚会"],
  piece: ["西装外套", "衬衫", "针织衫", "半裙", "直筒裤", "运动鞋", "托特包", "大衣", "靴子", "单肩包"]
};

const elements = {
  outfitView: document.querySelector("#outfitView"),
  closetView: document.querySelector("#closetView"),
  viewTitle: document.querySelector("#viewTitle"),
  searchInput: document.querySelector("#searchInput"),
  styleFilter: document.querySelector("#styleFilter"),
  seasonFilter: document.querySelector("#seasonFilter"),
  colorFilter: document.querySelector("#colorFilter"),
  replicaFilter: document.querySelector("#replicaFilter"),
  replicaFilterWrap: document.querySelector("#replicaFilterWrap"),
  outfitCount: document.querySelector("#outfitCount"),
  closetCount: document.querySelector("#closetCount"),
  readyCount: document.querySelector("#readyCount"),
  outfitDialog: document.querySelector("#outfitDialog"),
  itemDialog: document.querySelector("#itemDialog"),
  outfitForm: document.querySelector("#outfitForm"),
  itemForm: document.querySelector("#itemForm")
};

document.querySelectorAll(".nav-tab").forEach((button) => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view;
    document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

document.querySelector("#openAddOutfit").addEventListener("click", () => {
  openOutfitForm();
});

document.querySelector("#openAddItem").addEventListener("click", () => {
  openItemForm();
});

document.querySelector("#resetDemo").addEventListener("click", async () => {
  if (!confirm("这会删除当前衣橱和穿搭数据，并恢复示例内容。确定继续吗？")) return;
  await resetDemoData();
  state = await loadState();
  render();
});

document.querySelector("#exportData").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `wardrobe-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#importData").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());
    validateImportedState(imported);

    await replaceAllData(imported);
    state = await loadState();
    render();
  } catch (error) {
    alert(`导入失败：${error.message}`);
  } finally {
    event.target.value = "";
  }
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`#${button.dataset.close}`).close();
  });
});

[elements.searchInput, elements.styleFilter, elements.seasonFilter, elements.colorFilter, elements.replicaFilter].forEach((input) => {
  input.addEventListener("input", renderCards);
});

elements.outfitForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(elements.outfitForm);
    const linkedItemIds = Array.from(elements.outfitForm.linkedItems.selectedOptions).map((option) => option.value);
    const uploadedImage = await readImageFile(elements.outfitForm.imageFile.files[0]);
    const currentOutfit = editingOutfitId ? state.outfits.find((outfit) => outfit.id === editingOutfitId) : null;
    const outfit = {
      id: editingOutfitId || crypto.randomUUID(),
      title: formData.get("title").trim(),
      image: uploadedImage || formData.get("image").trim() || currentOutfit?.image || "",
      styles: getTagFieldValues(elements.outfitForm, "styles"),
      seasons: getTagFieldValues(elements.outfitForm, "seasons"),
      mainColor: getTagFieldValues(elements.outfitForm, "mainColor")[0],
      pieces: getTagFieldValues(elements.outfitForm, "pieces"),
      occasions: getTagFieldValues(elements.outfitForm, "occasions"),
      replicaStatus: formData.get("replicaStatus"),
      linkedItemIds,
      notes: formData.get("notes").trim(),
      createdAt: currentOutfit?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    await saveOutfit(outfit);
    state = await loadState();
    elements.outfitDialog.close();
    editingOutfitId = null;
    render();
  } catch (error) {
    alert(error.message);
  }
});

elements.itemForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(elements.itemForm);
    const uploadedImage = await readImageFile(elements.itemForm.imageFile.files[0]);
    const currentItem = editingItemId ? state.closetItems.find((item) => item.id === editingItemId) : null;
    const item = {
      id: editingItemId || crypto.randomUUID(),
      name: formData.get("name").trim(),
      image: uploadedImage || formData.get("image").trim() || currentItem?.image || "",
      type: formData.get("type"),
      piece: getTagFieldValues(elements.itemForm, "piece")[0],
      mainColor: getTagFieldValues(elements.itemForm, "mainColor")[0],
      seasons: getTagFieldValues(elements.itemForm, "seasons"),
      styles: getTagFieldValues(elements.itemForm, "styles"),
      status: formData.get("status"),
      notes: formData.get("notes").trim(),
      createdAt: currentItem?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    await saveClosetItem(item);
    state = await loadState();
    elements.itemDialog.close();
    editingItemId = null;
    render();
  } catch (error) {
    alert(error.message);
  }
});

elements.outfitView.addEventListener("click", (event) => {
  const button = event.target.closest("[data-edit-outfit]");
  if (!button) return;
  const outfit = state.outfits.find((item) => item.id === button.dataset.editOutfit);
  if (outfit) openOutfitForm(outfit);
});

elements.closetView.addEventListener("click", (event) => {
  const button = event.target.closest("[data-edit-item]");
  if (!button) return;
  const item = state.closetItems.find((closetItem) => closetItem.id === button.dataset.editItem);
  if (item) openItemForm(item);
});

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("当前浏览器不支持 IndexedDB"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.addEventListener("upgradeneeded", () => {
      const database = request.result;
      if (!database.objectStoreNames.contains("closetItems")) {
        database.createObjectStore("closetItems", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("outfits")) {
        database.createObjectStore("outfits", { keyPath: "id" });
      }
    });
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

function getAllRecords(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).getAll();
    request.addEventListener("success", () => {
      resolve(request.result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });
    request.addEventListener("error", () => reject(request.error));
  });
}

function putRecord(storeName, record) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(record);
    transaction.addEventListener("complete", resolve);
    transaction.addEventListener("error", () => reject(transaction.error));
  });
}

async function saveOutfit(outfit) {
  if (db) {
    await putRecord("outfits", outfit);
    return;
  }

  const current = await loadState();
  const outfits = current.outfits.filter((currentOutfit) => currentOutfit.id !== outfit.id);
  localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify({
    closetItems: current.closetItems,
    outfits: [outfit, ...outfits]
  }));
}

async function saveClosetItem(item) {
  if (db) {
    await putRecord("closetItems", item);
    return;
  }

  const current = await loadState();
  const closetItems = current.closetItems.filter((currentItem) => currentItem.id !== item.id);
  localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify({
    closetItems: [item, ...closetItems],
    outfits: current.outfits
  }));
}

function clearStore(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).clear();
    transaction.addEventListener("complete", resolve);
    transaction.addEventListener("error", () => reject(transaction.error));
  });
}

async function loadState() {
  if (!db) {
    const saved = localStorage.getItem(FALLBACK_STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(demoData);
  }

  return {
    closetItems: await getAllRecords("closetItems"),
    outfits: await getAllRecords("outfits")
  };
}

async function seedIfEmpty() {
  if (!db) {
    if (!localStorage.getItem(FALLBACK_STORAGE_KEY)) {
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(demoData));
    }
    return;
  }

  const current = await loadState();
  if (current.closetItems.length || current.outfits.length) return;
  await resetDemoData();
}

async function resetDemoData() {
  if (!db) {
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(demoData));
    return;
  }

  await clearStore("closetItems");
  await clearStore("outfits");
  await Promise.all(demoData.closetItems.map((item) => putRecord("closetItems", { ...item, createdAt: Date.now() + item.createdAt })));
  await Promise.all(demoData.outfits.map((outfit) => putRecord("outfits", { ...outfit, createdAt: Date.now() + outfit.createdAt })));
}

async function replaceAllData(nextState) {
  if (!db) {
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(nextState));
    return;
  }

  await clearStore("closetItems");
  await clearStore("outfits");
  await Promise.all(nextState.closetItems.map((item) => putRecord("closetItems", { ...item, createdAt: item.createdAt || Date.now() })));
  await Promise.all(nextState.outfits.map((outfit) => putRecord("outfits", { ...outfit, createdAt: outfit.createdAt || Date.now() })));
}

function openDialog(dialog) {
  if (document.body.classList.contains("mobile-preview")) {
    dialog.show();
    return;
  }

  dialog.showModal();
}

function openOutfitForm(outfit = null) {
  editingOutfitId = outfit?.id || null;
  elements.outfitForm.reset();
  fillLinkedItemOptions(outfit?.linkedItemIds || []);
  initializeFormTagPickers(elements.outfitForm);

  elements.outfitForm.querySelector("h3").textContent = outfit ? "编辑穿搭灵感" : "新增穿搭灵感";
  elements.outfitForm.querySelector("button[type='submit']").textContent = outfit ? "保存修改" : "保存穿搭";

  if (outfit) {
    elements.outfitForm.title.value = outfit.title;
    elements.outfitForm.image.value = outfit.image || "";
    elements.outfitForm.replicaStatus.value = outfit.replicaStatus;
    elements.outfitForm.notes.value = outfit.notes || "";
    setTagFieldValues(elements.outfitForm, "styles", outfit.styles);
    setTagFieldValues(elements.outfitForm, "seasons", outfit.seasons);
    setTagFieldValues(elements.outfitForm, "mainColor", [outfit.mainColor]);
    setTagFieldValues(elements.outfitForm, "pieces", outfit.pieces);
    setTagFieldValues(elements.outfitForm, "occasions", outfit.occasions);
    Array.from(elements.outfitForm.linkedItems.options).forEach((option) => {
      option.selected = outfit.linkedItemIds.includes(option.value);
    });
  }

  openDialog(elements.outfitDialog);
}

function openItemForm(item = null) {
  editingItemId = item?.id || null;
  elements.itemForm.reset();
  initializeFormTagPickers(elements.itemForm);

  elements.itemForm.querySelector("h3").textContent = item ? "编辑衣柜单品" : "新增衣柜单品";
  elements.itemForm.querySelector("button[type='submit']").textContent = item ? "保存修改" : "保存单品";

  if (item) {
    elements.itemForm.name.value = item.name;
    elements.itemForm.image.value = item.image || "";
    elements.itemForm.type.value = item.type;
    elements.itemForm.status.value = item.status;
    elements.itemForm.notes.value = item.notes || "";
    setTagFieldValues(elements.itemForm, "piece", [item.piece]);
    setTagFieldValues(elements.itemForm, "mainColor", [item.mainColor]);
    setTagFieldValues(elements.itemForm, "seasons", item.seasons);
    setTagFieldValues(elements.itemForm, "styles", item.styles);
  }

  openDialog(elements.itemDialog);
}

function initializeFormTagPickers(form) {
  form.querySelectorAll(".tag-field").forEach((field) => {
    field.dataset.values = "[]";
    renderTagField(field);
  });
}

function renderTagField(field) {
  const fieldName = field.dataset.field;
  const label = field.dataset.label;
  const values = getFieldSelection(field);
  const options = getTagOptions(fieldName);
  const customValues = values.filter((value) => !options.includes(value));
  const visibleOptions = unique([...options, ...customValues]);
  const selectedMarkup = values.length
    ? values.map((value) => `
        <button class="selected-tag" type="button" data-remove-tag="${escapeHtml(value)}">
          ${escapeHtml(value)} <span aria-hidden="true">x</span>
        </button>
      `).join("")
    : "";

  field.innerHTML = `
    <label>
      <span>${escapeHtml(label)}</span>
      <div class="tag-picker">
        <div class="selected-tags">${selectedMarkup}</div>
        <div class="option-tags" aria-label="${escapeHtml(label)}可选标签">
          ${visibleOptions.map((option) => `
            <button class="option-tag ${values.includes(option) ? "active" : ""}" type="button" data-option-tag="${escapeHtml(option)}">
              ${escapeHtml(option)}
            </button>
          `).join("")}
        </div>
        <div class="tag-controls">
          <input data-new-tag type="text" placeholder="新增${escapeHtml(label)}标签" />
          <button class="secondary small-button" type="button" data-add-new>新增</button>
        </div>
      </div>
    </label>
  `;

  field.querySelectorAll("[data-option-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleTagValue(field, button.dataset.optionTag);
    });
  });

  field.querySelector("[data-add-new]").addEventListener("click", () => {
    const input = field.querySelector("[data-new-tag]");
    addTagValue(field, input.value);
  });

  field.querySelector("[data-new-tag]").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTagValue(field, event.target.value);
    }
  });

  field.querySelectorAll("[data-remove-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      setFieldSelection(field, values.filter((value) => value !== button.dataset.removeTag));
      renderTagField(field);
    });
  });
}

function toggleTagValue(field, rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return;

  const isSingle = field.dataset.single === "true";
  const currentValues = getFieldSelection(field);
  const values = currentValues.includes(value)
    ? currentValues.filter((currentValue) => currentValue !== value)
    : isSingle ? [value] : unique([...currentValues, value]);
  setFieldSelection(field, values);
  renderTagField(field);
}

function addTagValue(field, rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return;

  const isSingle = field.dataset.single === "true";
  const values = isSingle ? [value] : unique([...getFieldSelection(field), value]);
  setFieldSelection(field, values);
  renderTagField(field);
}

function getFieldSelection(field) {
  try {
    return JSON.parse(field.dataset.values || "[]");
  } catch {
    return [];
  }
}

function setFieldSelection(field, values) {
  field.dataset.values = JSON.stringify(values);
}

function setTagFieldValues(form, fieldName, values) {
  const field = form.querySelector(`.tag-field[data-field="${fieldName}"]`);
  if (!field) return;
  setFieldSelection(field, values);
  renderTagField(field);
}

function getTagFieldValues(form, fieldName) {
  const field = form.querySelector(`.tag-field[data-field="${fieldName}"]`);
  const values = field ? getFieldSelection(field) : [];
  if (field?.dataset.required === "true" && !values.length) {
    throw new Error(`请选择${field.dataset.label}`);
  }
  return values;
}

function getTagOptions(fieldName) {
  const values = [...(defaultTags[fieldName] || [])];

  state.outfits.forEach((outfit) => {
    if (fieldName === "styles") values.push(...outfit.styles);
    if (fieldName === "seasons") values.push(...outfit.seasons);
    if (fieldName === "mainColor") values.push(outfit.mainColor);
    if (fieldName === "pieces") values.push(...outfit.pieces);
    if (fieldName === "occasions") values.push(...outfit.occasions);
  });

  state.closetItems.forEach((item) => {
    if (fieldName === "styles") values.push(...item.styles);
    if (fieldName === "seasons") values.push(...item.seasons);
    if (fieldName === "mainColor") values.push(item.mainColor);
    if (fieldName === "piece" || fieldName === "pieces") values.push(item.piece);
  });

  return unique(values);
}

function readImageFile(file) {
  if (!file) return Promise.resolve("");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function render() {
  elements.viewTitle.textContent = currentView === "outfits" ? "穿搭灵感库" : "我的衣柜";
  elements.outfitView.classList.toggle("hidden", currentView !== "outfits");
  elements.closetView.classList.toggle("hidden", currentView !== "closet");
  elements.replicaFilterWrap.classList.toggle("hidden", currentView !== "outfits");
  renderFilters();
  renderCards();
  renderStats();
}

function renderFilters() {
  const styles = currentView === "outfits"
    ? state.outfits.flatMap((item) => item.styles)
    : state.closetItems.flatMap((item) => item.styles);
  const seasons = currentView === "outfits"
    ? state.outfits.flatMap((item) => item.seasons)
    : state.closetItems.flatMap((item) => item.seasons);
  const colors = currentView === "outfits"
    ? state.outfits.map((item) => item.mainColor)
    : state.closetItems.map((item) => item.mainColor);

  fillSelect(elements.styleFilter, "全部风格", unique(styles));
  fillSelect(elements.seasonFilter, "全部季节", unique(seasons));
  fillSelect(elements.colorFilter, "全部主色", unique(colors));
  fillSelect(elements.replicaFilter, "全部状态", ["可复刻", "缺少单品", "仅作灵感"]);
}

function fillSelect(select, label, values) {
  const selected = select.value;
  select.innerHTML = [`<option value="">${label}</option>`, ...values.map((value) => `<option>${escapeHtml(value)}</option>`)].join("");
  select.value = values.includes(selected) ? selected : "";
}

function fillLinkedItemOptions(selectedIds = []) {
  elements.outfitForm.linkedItems.innerHTML = state.closetItems
    .map((item) => `<option value="${escapeHtml(item.id)}" ${selectedIds.includes(item.id) ? "selected" : ""}>${escapeHtml(item.name)} / ${escapeHtml(item.piece)} / ${escapeHtml(item.mainColor)}</option>`)
    .join("");
}

function validateImportedState(imported) {
  if (!imported || !Array.isArray(imported.closetItems) || !Array.isArray(imported.outfits)) {
    throw new Error("备份文件格式不对");
  }

  const requireString = (value) => typeof value === "string";
  const requireStringArray = (value) => Array.isArray(value) && value.every(requireString);
  const validClosetItem = (item) => item && ["id", "name", "image", "type", "piece", "mainColor", "status", "notes"].every((key) => requireString(item[key]))
    && requireStringArray(item.seasons)
    && requireStringArray(item.styles);
  const validOutfit = (outfit) => outfit && ["id", "title", "image", "mainColor", "replicaStatus", "notes"].every((key) => requireString(outfit[key]))
    && requireStringArray(outfit.styles)
    && requireStringArray(outfit.seasons)
    && requireStringArray(outfit.pieces)
    && requireStringArray(outfit.occasions)
    && requireStringArray(outfit.linkedItemIds);

  if (!imported.closetItems.every(validClosetItem) || !imported.outfits.every(validOutfit)) {
    throw new Error("备份文件包含无效或缺失的字段");
  }
}

function renderCards() {
  if (currentView === "outfits") {
    const outfits = state.outfits.filter(matchesOutfitFilters);
    elements.outfitView.innerHTML = outfits.length
      ? outfits.map(renderOutfitCard).join("")
      : `<div class="empty">没有找到匹配的穿搭。换个筛选条件试试看。</div>`;
    return;
  }

  const items = state.closetItems.filter(matchesClosetFilters);
  elements.closetView.innerHTML = items.length
    ? items.map(renderClosetCard).join("")
    : `<div class="empty">没有找到匹配的衣柜单品。</div>`;
}

function matchesOutfitFilters(outfit) {
  const search = elements.searchInput.value.trim().toLowerCase();
  const linkedItems = outfit.linkedItemIds.map(findClosetItem).filter(Boolean);
  const searchText = [
    outfit.title,
    outfit.mainColor,
    outfit.notes,
    outfit.replicaStatus,
    ...outfit.styles,
    ...outfit.seasons,
    ...outfit.pieces,
    ...outfit.occasions,
    ...linkedItems.map((item) => item.name)
  ].join(" ").toLowerCase();

  return (!search || searchText.includes(search))
    && (!elements.styleFilter.value || outfit.styles.includes(elements.styleFilter.value))
    && (!elements.seasonFilter.value || outfit.seasons.includes(elements.seasonFilter.value))
    && (!elements.colorFilter.value || outfit.mainColor === elements.colorFilter.value)
    && (!elements.replicaFilter.value || outfit.replicaStatus === elements.replicaFilter.value);
}

function matchesClosetFilters(item) {
  const search = elements.searchInput.value.trim().toLowerCase();
  const searchText = [
    item.name,
    item.type,
    item.piece,
    item.mainColor,
    item.status,
    item.notes,
    ...item.styles,
    ...item.seasons
  ].join(" ").toLowerCase();

  return (!search || searchText.includes(search))
    && (!elements.styleFilter.value || item.styles.includes(elements.styleFilter.value))
    && (!elements.seasonFilter.value || item.seasons.includes(elements.seasonFilter.value))
    && (!elements.colorFilter.value || item.mainColor === elements.colorFilter.value);
}

function renderOutfitCard(outfit) {
  const linkedItems = outfit.linkedItemIds.map(findClosetItem).filter(Boolean);
  return `
    <article class="card">
      <div class="image-wrap">
        ${renderImage(outfit.image, outfit.title)}
        <span class="status">${escapeHtml(outfit.replicaStatus)}</span>
      </div>
      <div class="card-body">
        <h3>${escapeHtml(outfit.title)}</h3>
        <div class="tags">
          <span class="tag color">主色 ${escapeHtml(outfit.mainColor)}</span>
          ${outfit.styles.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          ${outfit.seasons.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <p class="meta">款式：${escapeHtml(outfit.pieces.join(" / "))}</p>
        <p class="linked">关联衣柜：${linkedItems.length ? escapeHtml(linkedItems.map((item) => item.name).join(" / ")) : "暂未关联"}</p>
        ${outfit.notes ? `<p class="meta">${escapeHtml(outfit.notes)}</p>` : ""}
        <div class="card-actions">
          <button class="secondary small-button" type="button" data-edit-outfit="${escapeHtml(outfit.id)}">详情/编辑</button>
        </div>
      </div>
    </article>
  `;
}

function renderClosetCard(item) {
  const linkedCount = state.outfits.filter((outfit) => outfit.linkedItemIds.includes(item.id)).length;
  return `
    <article class="card">
      <div class="image-wrap">
        ${renderImage(item.image, item.name)}
        <span class="status">${escapeHtml(item.status)}</span>
      </div>
      <div class="card-body">
        <h3>${escapeHtml(item.name)}</h3>
        <div class="tags">
          <span class="tag color">主色 ${escapeHtml(item.mainColor)}</span>
          <span class="tag">${escapeHtml(item.type)}</span>
          <span class="tag">${escapeHtml(item.piece)}</span>
          ${item.seasons.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <p class="linked">已关联 ${linkedCount} 套穿搭灵感</p>
        ${item.notes ? `<p class="meta">${escapeHtml(item.notes)}</p>` : ""}
        <div class="card-actions">
          <button class="secondary small-button" type="button" data-edit-item="${escapeHtml(item.id)}">详情/编辑</button>
        </div>
      </div>
    </article>
  `;
}

function renderImage(src, alt) {
  if (!src) return `<div class="image-fallback">${escapeHtml(alt.slice(0, 8))}</div>`;
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" onerror="this.replaceWith(Object.assign(document.createElement('div'), {className: 'image-fallback', textContent: '图片未加载'}))" />`;
}

function findClosetItem(id) {
  return state.closetItems.find((item) => item.id === id);
}

function renderStats() {
  elements.outfitCount.textContent = state.outfits.length;
  elements.closetCount.textContent = state.closetItems.length;
  elements.readyCount.textContent = state.outfits.filter((outfit) => outfit.replicaStatus === "可复刻").length;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function initializeApp() {
  try {
    db = await openDatabase();
  } catch {
    db = null;
  }
  await seedIfEmpty();
  state = await loadState();
  render();
  openDialogFromHash();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
}

function openDialogFromHash() {
  if (location.hash === "#add-outfit") {
    openOutfitForm();
  }

  if (location.hash === "#add-item") {
    openItemForm();
  }
}

initializeApp().catch((error) => {
  alert(`启动失败：${error.message}`);
});
