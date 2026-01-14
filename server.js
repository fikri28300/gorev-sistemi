const express=require("express");
const session=require("express-session");
const sqlite3=require("sqlite3").verbose();
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({secret:"gorev",resave:false,saveUninitialized:true}));
app.use(express.static("public"));

const db=new sqlite3.Database("database.db");

db.serialize(()=>{
 db.run(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,role TEXT,username TEXT,password TEXT)`);
 db.run(`CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,description TEXT,status TEXT,priority INTEGER,created_by TEXT)`);
 db.run(`INSERT OR IGNORE INTO users(id,name,role,username,password) VALUES(1,'Müdür','mudur','admin','1234')`);
});

app.post("/login",(r,s)=>{
 db.get("SELECT * FROM users WHERE username=? AND password=?",[r.body.username,r.body.password],(e,u)=>{
  if(!u) return s.redirect("/login.html");
  r.session.user=u; s.redirect("/tasks.html");
 });
});

app.get("/tasks",(r,s)=>db.all("SELECT * FROM tasks ORDER BY priority",[],(e,d)=>s.json(d)));

app.post("/tasks",(r,s)=>{
 db.run(`INSERT INTO tasks(title,status,priority,created_by) VALUES(?, 'beklemede',(SELECT IFNULL(MAX(priority),0)+1 FROM tasks),?)`,
 [r.body.title,r.body.user],()=>s.sendStatus(200));
});

app.post("/tasks/update",(r,s)=>{
 db.run("UPDATE tasks SET status=?,description=? WHERE id=?",[r.body.status,r.body.description,r.body.id],()=>s.sendStatus(200));
});

app.post("/tasks/reorder",(r,s)=>{
 const st=db.prepare("UPDATE tasks SET priority=? WHERE id=?");
 r.body.order.forEach(o=>st.run(o.priority,o.id));
 st.finalize(); s.sendStatus(200);
});

app.get("/users",(r,s)=>db.all("SELECT id,name,role FROM users",[],(e,d)=>s.json(d)));
app.post("/users",(r,s)=>db.run("INSERT INTO users(name,role,username,password) VALUES(?,?,?,?)",
[r.body.name,r.body.role,r.body.username,r.body.password],()=>s.sendStatus(200)));
app.post("/users/delete",(r,s)=>db.run("DELETE FROM users WHERE id=?",[r.body.id],()=>s.sendStatus(200)));

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log("Çalışıyor"));