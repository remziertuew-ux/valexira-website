(() => {
  "use strict";

  const materials = {
    white: {
      name: "Beyaz zeminli folyo",
      caption: "Beyaz taban, baskı renklerini öne çıkarır ve camın arkasını kapatır.",
      description: "Beyaz zeminli baskı görseli dışarıdan canlı gösterir. Camın arkasını kapatır; gerçek ışık davranışı seçilen folyonun ürün özelliklerine göre değişebilir."
    },
    blockout: {
      name: "Gri örtücü folyo",
      caption: "Işığı geçirmeyen, camın arkasını tamamen kapatan örtücü görünüm.",
      description: "Gri örtücü seçenek ışık geçişini keser. Bu temsili önizlemede cam tamamen kapalı görünür; üretilecek ürünün teknik özellikleri teklif öncesinde teyit edilir."
    },
    oneway: {
      name: "One Way Vision · delikli folyo",
      caption: "Delikler ışık ve görüş geçirir; baskı görünümü ortam aydınlığına göre değişir.",
      description: "Gündüz dışarıdan baskı öne çıkar, içeriden delikler arasından dışarısı görülebilir. Gece içerisi aydınlıksa tek yön etkisi azalır; bu ürün gece mahremiyetini garanti etmez."
    },
    frost: {
      name: "Kumlama · buzlu folyo",
      caption: "Işığı yumuşatır; net görüşü dağıtarak mahremiyet sağlar.",
      description: "Buzlu yüzey ışığı geçirir ama ayrıntıları bulanıklaştırır. Ofis bölmeleri ve vitrinlerde mahremiyet için kullanılır; tamamen ışık kesen bir kaplama değildir."
    }
  };

  const stage = document.getElementById("windowStage");
  const materialButtons = [...document.querySelectorAll("[data-material-choice]")];
  const sideButtons = [...document.querySelectorAll("[data-side-choice]")];
  const lightButtons = [...document.querySelectorAll("[data-light-choice]")];
  const widthInput = document.getElementById("widthInput");
  const heightInput = document.getElementById("heightInput");
  const areaValue = document.getElementById("areaValue");
  const quoteLink = document.getElementById("quoteLink");
  const cornerLabel = document.getElementById("stageCornerLabel");
  const captionTitle = document.getElementById("materialCaptionTitle");
  const caption = document.getElementById("materialCaption");

  let selectedMaterial = "white";
  let selectedSide = "outside";
  let selectedLight = "day";

  function validDimension(input) {
    const value = Number.parseFloat(input.value);
    return Number.isFinite(value) && value >= 0.2 && value <= 30 ? value : null;
  }

  function updateArea() {
    const width = validDimension(widthInput);
    const height = validDimension(heightInput);
    widthInput.setAttribute("aria-invalid", String(width === null));
    heightInput.setAttribute("aria-invalid", String(height === null));

    if (width === null || height === null) {
      areaValue.textContent = "Ölçüyü kontrol edin";
      areaValue.classList.add("is-invalid");
    } else {
      areaValue.textContent = `${(width * height).toFixed(2).replace(".", ",")} m²`;
      areaValue.classList.remove("is-invalid");
    }
    updateQuote();
  }

  function updateQuote() {
    const material = materials[selectedMaterial];
    const width = validDimension(widthInput);
    const height = validDimension(heightInput);
    const dimensions = width !== null && height !== null
      ? `${width.toString().replace(".", ",")} m x ${height.toString().replace(".", ",")} m`
      : "Ölçü henüz girilmedi";
    const area = width !== null && height !== null
      ? ` (yaklaşık ${(width * height).toFixed(2).replace(".", ",")} m²)`
      : "";
    const message = [
      "Merhaba Valexira Dijital, folyo simülasyonunda bir ürün seçtim.",
      `Folyo: ${material.name}`,
      `Ölçü: ${dimensions}${area}`,
      "Uygulama için fiyat ve bilgi rica ediyorum."
    ].join("\n");
    quoteLink.href = `https://wa.me/905427412994?text=${encodeURIComponent(message)}`;
  }

  function updateStage() {
    stage.dataset.material = selectedMaterial;
    stage.dataset.side = selectedSide;
    stage.dataset.light = selectedLight;
    stage.setAttribute(
      "aria-label",
      `${materials[selectedMaterial].name} için ${selectedSide === "outside" ? "dışarıdan" : "içeriden"} vitrin simülasyonu, ${selectedLight === "day" ? "gündüz" : "gece"} ışık senaryosu`
    );
    cornerLabel.textContent = selectedSide === "outside" ? "DIŞARIDAN BAKIŞ" : "İÇERİDEN BAKIŞ";
    captionTitle.textContent = materials[selectedMaterial].name;
    caption.textContent = materials[selectedMaterial].description;
    updateQuote();
  }

  materialButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedMaterial = button.dataset.materialChoice;
      materialButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-selected", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateStage();
    });
  });

  sideButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedSide = button.dataset.sideChoice;
      sideButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateStage();
    });
  });

  lightButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedLight = button.dataset.lightChoice;
      lightButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateStage();
    });
  });

  [widthInput, heightInput].forEach((input) => {
    input.addEventListener("input", updateArea);
    input.addEventListener("change", () => {
      const value = Number.parseFloat(input.value);
      if (Number.isFinite(value)) {
        input.value = String(Math.min(30, Math.max(0.2, value)));
      }
      updateArea();
    });
  });

  updateArea();
  updateStage();
})();
