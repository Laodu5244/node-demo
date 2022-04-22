const Koa = require("koa");
const router = require("koa-router")();
const views = require("koa-views");
const nunjucks = require("nunjucks");
const session = require("koa-session");
const parser = require("koa-parser");
const app = new Koa();

app.use(parser());
app.keys = ["123456"];
app.use(session({
  maxAge: 30 * 1000
}, app))

app.use(views(__dirname + "/views", {
  map: { html: "nunjucks" }
}))

// 首页:任何用户都可以访问
router.get("/", async ctx => {
  await ctx.render("home.html")
})

// 登录页:任何用户都可以访问
router.get("/login", async ctx => {
  await ctx.render("login.html")
})
// 内容页:只有登陆成功后才能访问
router.get("/list", async ctx => {
  if (ctx.session.user) {
    await ctx.render("list.html")
  } else {
    ctx.redirect("/")
  }
  await ctx.render("list.html")
})

//注销功能
router.get("/logout", async ctx => {
  ctx.session.user = "";
  ctx.redirect("/");
})

// 处理请求的路由
router.post("/login", async ctx => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  if (username === "metal" && password === "123456") {
    ctx.session.user = "metal"
    // 重定向
    ctx.redirect("/list")
  } else {
    ctx.redirect("/")
  }
})

app.use(router.routes());

app.listen("6060", () => {
  console.log("服务器已经启动")
})