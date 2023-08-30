#![feature(proc_macro_hygiene, decl_macro)]
#[macro_use]
extern crate serde_derive;

use rocket_contrib::serve::StaticFiles;
use rocket_contrib::templates::Template;

#[macro_use]
extern crate rocket;

#[derive(Serialize)]
struct TemplateContext {
    items: Vec<&'static str>,
}

#[get("/")]
fn index() -> Template {
    let context = TemplateContext {
        items: vec!["Jocellyn Luna"],
    };
    Template::render("index", &context)
}

#[get("/data")]
fn data() -> Template {
    let context = TemplateContext {
        items: vec!["Jocellyn Luna"],
    };
    Template::render("data-load", &context)
}

#[catch(404)]
fn not_found() -> Template {
    let context = TemplateContext {
        items: vec!["Jocellyn Luna"],
    };
    Template::render("404", &context)
}

fn main() {
    rocket::ignite()
        .mount("/", routes![index, data])
        .mount("/", StaticFiles::from("templates"))
        .attach(Template::fairing())
        .register(catchers![not_found])
        .launch();
}
