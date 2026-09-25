// Núcleo compartilhado: transforma uma linha do Cadastro_Produto em produto do portfólio.
// O mesmo código roda no seed (node) e dentro do portal (importação de planilha).
var CORE = (function () {
  var CATEGORIAS = [
    { slug: "refrigerantes", nome: "Refrigerantes" },
    { slug: "sucos", nome: "Néctares e sucos" },
    { slug: "sementes", nome: "À base de sementes" },
    { slug: "chas", nome: "Chás" },
    { slug: "aguas", nome: "Águas" },
    { slug: "energeticos", nome: "Energéticos" },
    { slug: "performance", nome: "Performance" },
    { slug: "cervejas", nome: "Cervejas" },
    { slug: "drinks", nome: "Drinks prontos" },
    { slug: "destilados", nome: "Destilados" },
    { slug: "bomboniere", nome: "Bomboniere" }
  ];

  // marca do cadastro -> slug da marca no portfólio
  var MARCA_MAP = {
    "COCA-COLA": "coca-cola", "COCA COLA ZERO": "coca-cola", "COCA COLA SEM ACUCAR": "coca-cola",
    "FANTA": "fanta", "SPRITE": "sprite", "KUAT": "kuat", "SCHWEPPES": "schweppes",
    "GUARANA JESUS": "guarana-jesus", "SCHWEPPES DRINKS": "schweppes-drinks",
    "DEL VALLE +": "del-valle", "DEL VALLE": "del-valle", "DEL VALLE 100%": "del-valle",
    "DEL VALLE FRUT": "del-valle-frut", "ADES": "ades", "KAPO": "kapo", "LEAO ICE TEA": "leao",
    "POWERADE": "powerade", "AGUA CRYSTAL": "crystal", "ACQUA LIA": "acqua-lia",
    "MONSTER": "monster", "REIGN": "reign",
    "HEINEKEN": "heineken", "AMSTEL": "amstel", "EISENBAHN": "eisenbahn", "KAISER": "kaiser",
    "BAVARIA": "bavaria", "SOL PREMIUN": "sol", "SOL": "sol", "DEVASSA": "devassa",
    "CERVEZAS 1906": "1906", "EST.GAL.": "estrella-galicia", "GLACIAL": "glacial", "PRAYA": "praya",
    "CAMPARI": "campari", "APEROL": "aperol", "SAGATIBA": "sagatiba", "CINZANO": "cinzano",
    "DREHER": "dreher", "CYNAR": "cynar", "LIEBFRAUMILCH": "liebfraumilch", "FRANGELICO": "frangelico",
    "BULLDOG": "bulldog", "DRURY'S": "drurys", "OLD EIGHT": "old-eight", "SKYY": "skyy",
    "WILD TURKEY": "wild-turkey", "JOHNNIE WALKER": "johnnie-walker", "CIROC": "ciroc",
    "GORDON''S": "gordons", "GORDON'S": "gordons", "OLD PARR": "old-parr", "SMIRNOFF": "smirnoff",
    "TANQUERAY": "tanqueray", "JACK&COKE": "jack-coke", "ABSOLUT SPRITE": "absolut-sprite",
    "SMIRNOFF ICE": "smirnoff-ice", "MENTOS": "mentos", "FRUITELLA": "fruittella", "FINI": "fini"
  };

  var GRUPO_CAT = {
    "Refrigerantes": "refrigerantes", "Cerveja": "cervejas", "Destilados": "destilados",
    "Água": "aguas", "ARTD": "drinks", "Bomboniere": "bomboniere", "Still": "sucos"
  };

  var DIC = {
    "DV": "Del Valle", "SCHW": "Schweppes", "CC": "Coca-Cola", "COCA-COLA": "Coca-Cola", "COCA": "Coca",
    "ZER": "Zero", "ZR": "Zero", "ZZ": "Zero", "BLACKZER": "Black Zero", "S/A": "Sem Açúcar",
    "S/GAS": "sem Gás", "S/G": "sem Gás", "C/GAS": "com Gás", "LAR": "Laranja", "LIM": "Limão",
    "LIMAO": "Limão", "ABCX": "Abacaxi", "ABCX-TAN": "Abacaxi-Tangerina", "TAN": "Tangerina",
    "MARAC": "Maracujá", "MAR": "Maracujá", "PES": "Pêssego", "MOR": "Morango", "MAN-MOR": "Manga-Morango",
    "MANG": "Manga", "MELAN": "Melancia", "MACA": "Maçã", "NEC": "Néctar", "TROP": "Tropical",
    "GUA": "Guaraná", "GUARANA": "Guaraná", "TON": "Tônica", "TONICA": "Tônica", "PILS": "Pilsen",
    "ORIG": "Original", "FRAMB": "Framboesa", "HORTELA": "Hortelã", "CAFE": "Café", "PREM": "Premium",
    "ULT": "Ultra", "ULTRAVIO": "Ultraviolet", "EST": "Estrella", "GAL": "Galicia", "SAGA.": "Sagatiba",
    "CINZ.": "Cinzano", "CINZ.VTH": "Cinzano Vermouth", "ENVELHICIDA": "Envelhecida",
    "ABS": "Absolut", "LIEBFRAULMILCH": "Liebfraumilch", "SPMINT": "Spearmint", "MNT/WINT": "Mint/Wintergreen",
    "UNF": "Unfiltered", "VERM": "Vermelhas", "FRUITELLA": "Fruittella", "GOI": "Goiaba", "AGUA": "Água", "GALAO": "Galão", "MACA-VERDE": "Maçã Verde",
    "JACK&COKE": "Jack & Coke", "GORDON'S": "Gordon's", "DRURY'S": "Drury's", "PT": "PET", "M&M": "M&M",
    "UP2U": "UP2U", "IPA": "IPA", "XBOX": "Xbox", "8P": "8P", "100%": "100%", "+": "+"
  };
  var EMB_CODES = { LT: 1, LN: 1, KS: 1, VR: 1, OW: 1, TP: 1, CP: 1, RP: 1, NS: 1, LS: 1, KG: 1, BG: 1, GL: 1, SL: 1, MP: 1, PET: 1 };
  var TIPO_NOME = {
    "LATA": "Lata", "PET": "PET", "REF PET": "PET retornável", "TETRA PACK": "Tetra Pak",
    "VIDRO NAO RETORNAVEL": "Vidro", "VIDRO RETORNAVEL": "Vidro retornável", "LONG NECK": "Long neck",
    "KS": "Vidro retornável", "LS": "Vidro retornável", "NS": "Vidro retornável", "BARRIL": "Barril",
    "GALAO": "Galão", "BAG": "Bag", "COPO": "Copo", "GARRAFA": "Garrafa", "ONE WAY": "Vidro",
    "STICK": "Stick", "SLAB": "Slab", "MONOPORCAO": "Monoporção", "MONOPECA": "Monopeça",
    "35G": "Pacote", "CAIXA PLASTICA": "Caixa", "OUTROS": "Outros"
  };

  function pad2(n) { return n < 10 ? "0" + n : String(n); }

  function fmtVol(ml) {
    if (ml >= 1000) { var l = ml / 1000; return (Math.round(l * 100) / 100).toString().replace(".", ",") + "L"; }
    return ml + "ml";
  }

  function parseSize(nome, emb) {
    var s = (nome + " " + emb).toUpperCase();
    var m = s.match(/(\d+(?:,\d+)?)\s*L\b/);
    if (m) return fmtVol(Math.round(parseFloat(m[1].replace(",", ".")) * 1000));
    m = s.match(/(\d{2,5})\s*ML/);
    if (m) return fmtVol(parseInt(m[1], 10));
    m = s.match(/(\d+)\s*G\b/);
    if (m) return m[1] + "g";
    m = String(emb).toUpperCase().match(/^VNR\s*(\d{3,4})/);
    if (m) return fmtVol(parseInt(m[1], 10));
    m = String(nome).toUpperCase().match(/\b(\d{3,4})(?:\s*ML)?$/);
    if (m) return fmtVol(parseInt(m[1], 10));
    return "";
  }

  function titleWord(w) {
    if (DIC[w]) return DIC[w];
    if (EMB_CODES[w]) return w;
    var m = w.match(/^LT(\d+)ML$/);
    if (m) return "LT " + m[1] + "ml";
    if (/^\d+(,\d+)?L$/.test(w)) return w;
    if (/^\d+ML$/.test(w)) return w.replace("ML", "ml");
    if (/^\d+G$/.test(w)) return w.replace("G", "g");
    if (/^\d+$/.test(w)) return w;
    if (w.length <= 2) return w;
    return w.charAt(0) + w.slice(1).toLowerCase();
  }

  function prettyName(raw, qtd) {
    var toks = String(raw).trim().split(/\s+/);
    var out = [];
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i].toUpperCase();
      if (/^CX\d+$/.test(t) || t === "C12" || t === "UN" || t === "CX") continue;
      if (t === "ML" && out.length && /^\d+$/.test(out[out.length - 1])) { out[out.length - 1] += "ml"; continue; }
      out.push(titleWord(t));
    }
    var n = out.join(" ").replace(/\s+/g, " ").trim();
    if (qtd && qtd > 1) n += " (" + pad2(qtd) + ")";
    return n;
  }

  function checkDigit(base12) {
    var s = 0;
    for (var i = 0; i < 12; i++) s += parseInt(base12[i], 10) * (i % 2 ? 3 : 1);
    return (10 - (s % 10)) % 10;
  }

  // EAN do cadastro pode ser EAN-13 da unidade, DUN-14 da caixa ou EAN-8.
  function normEan(code) {
    var c = String(code == null ? "" : code).replace(/\D/g, "");
    if (!c) return { ean: "", dun: "" };
    if (c.length === 14) {
      var base = c.slice(1, 13);
      return { ean: base + checkDigit(base), dun: c };
    }
    return { ean: c, dun: "" };
  }

  function slugify(s) {
    return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .replace(/&/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // row: objeto com as colunas da planilha (nomes originais)
  function fromRow(row) {
    var cod = parseInt(row["Cod. Produto"], 10);
    var nomeRaw = String(row["Produto"] || "").trim();
    var marcaRaw = String(row["Marca"] || "").trim();
    var emb = String(row["Embalagem"] || "").trim();
    var cxm = nomeRaw.toUpperCase().match(/CX\s?(\d+)/);
    var qtd = parseInt(row["Fator CX"], 10) || (cxm ? parseInt(cxm[1], 10) : 1);
    var marca = MARCA_MAP[marcaRaw];
    if (/^CHUPA\b/i.test(nomeRaw)) marca = "chupa";
    if (!marca) {
      var first = slugify(nomeRaw.split(/\s+/)[0] || "");
      marca = BRAND_CAT[first] ? first : (marcaRaw ? slugify(marcaRaw) : first);
    }
    var cat = BRAND_CAT[marca] || GRUPO_CAT[row["Grupo Especie"]] || "refrigerantes";
    var e = normEan(row["Cód. EAN / DUM"]);
    return {
      cod: cod,
      nomeCadastro: nomeRaw,
      nome: prettyName(nomeRaw, qtd),
      marca: marca,
      marcaCadastro: marcaRaw,
      categoria: cat,
      sabor: String(row["Sabor"] || "").trim(),
      tipo: TIPO_NOME[String(row["Tipo Embalagem"] || "").trim()] || String(row["Tipo Embalagem"] || "").trim(),
      tamanho: parseSize(nomeRaw, emb),
      qtd: qtd,
      ean: e.ean,
      dun: e.dun,
      suprimido: String(row["Suprimido"] || "").trim().toUpperCase() === "SIM",
      venda: emb !== "EMBALAGEM PARA TROCA"
    };
  }

  var BRAND_CAT = {
    "coca-cola": "refrigerantes", "fanta": "refrigerantes", "sprite": "refrigerantes", "kuat": "refrigerantes",
    "schweppes": "refrigerantes", "guarana-jesus": "refrigerantes",
    "del-valle": "sucos", "del-valle-frut": "sucos", "kapo": "sucos", "ades": "sementes", "leao": "chas",
    "crystal": "aguas", "acqua-lia": "aguas", "monster": "energeticos", "reign": "performance", "powerade": "performance",
    "heineken": "cervejas", "amstel": "cervejas", "eisenbahn": "cervejas", "kaiser": "cervejas", "bavaria": "cervejas",
    "sol": "cervejas", "devassa": "cervejas", "1906": "cervejas", "estrella-galicia": "cervejas", "glacial": "cervejas", "praya": "cervejas",
    "schweppes-drinks": "drinks", "jack-coke": "drinks", "absolut-sprite": "drinks", "smirnoff-ice": "drinks",
    "mentos": "bomboniere", "chupa": "bomboniere", "fruittella": "bomboniere", "fini": "bomboniere"
  };

  return {
    CATEGORIAS: CATEGORIAS, MARCA_MAP: MARCA_MAP, BRAND_CAT: BRAND_CAT,
    fromRow: fromRow, prettyName: prettyName, normEan: normEan, slugify: slugify, parseSize: parseSize
  };
})();
if (typeof module !== "undefined") module.exports = CORE;
