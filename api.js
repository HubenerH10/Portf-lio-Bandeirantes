// Comunicação com o backend (Apps Script) — usada pela landing page e pelo admin
var API = (function () {
  var URL_ = window.PORTAL_API || "";
  function configurado() { return /^https:\/\/script\.google(usercontent)?\.com\//.test(URL_); }
  async function get(action) {
    var r = await fetch(URL_ + "?action=" + action + "&t=" + Date.now(), { redirect: "follow" });
    if (!r.ok) throw new Error("Servidor respondeu " + r.status);
    return r.json();
  }
  async function post(acao, dados) {
    var body = Object.assign({ acao: acao, senha: sessionStorage.getItem("portalSenha") || "" }, dados || {});
    var r = await fetch(URL_, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body), redirect: "follow" });
    var j = await r.json();
    if (j.erro) { var e = new Error(j.erro === "senha" ? "Senha incorreta" : j.erro === "ocupado" ? "Outra pessoa está salvando. Tente de novo." : j.erro); e.code = j.erro; throw e; }
    return j;
  }
  return {
    configurado: configurado,
    catalogo: function () { return get("catalogo"); },
    versao: function () { return get("versao").then(function (j) { return j.versao; }); },
    post: post
  };
})();

// imagem: id do Drive, URL completa ou caminho relativo
function imgUrl(v, w) {
  if (!v) return "";
  if (/^(https?:|data:|blob:|img\/|\.\/)/.test(v)) return v;
  return "https://lh3.googleusercontent.com/d/" + v + "=w" + (w || 600);
}
