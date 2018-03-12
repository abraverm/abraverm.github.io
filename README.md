# Directory Structure Explained
The following is a high-level overview of each of the directories with links to
each of their respective sections within the Hugo docs.

## archetypes
You can create new content files in Hugo using the hugo new command. By
default, hugo will create new content files with at least date, title (inferred
from the file name), and draft = true. This saves time and promotes consistency
for sites using multiple content types. You can create your own archetypes with
  custom preconfigured front matter fields as well.

## config.toml
Every Hugo project should have a configuration file in TOML, YAML, or JSON
format at the root. Many sites may need little to no configuration, but Hugo
ships with a large number of configuration directives for more granular
directions on how you want Hugo to build your website.

## content
All content for your website will live inside this directory. Each top-level
folder in Hugo is considered a content section. For example, if your site has
three main sections—blog, articles, and tutorials—you will have three
directories at content/blog, content/articles, and content/tutorials. Hugo uses
sections to assign default content types.

## data
This directory is used to store configuration files that can be used by Hugo
when generating your website. You can write these files in YAML, JSON, or TOML
format. In addition to the files you add to this folder, you can also create
data templates that pull from dynamic content.

## layouts
Stores templates in the form of .html files that specify how views of your
content will be rendered into a static website. Templates include list pages,
your homepage, taxonomy templates, partials, single page templates, and more.

## static
stores all the static content for your future website: images, CSS, JavaScript,
etc. When Hugo builds your site, all assets inside your static directory are
copied over as-is. A good example of using the static folder is for verifying
site ownership on Google Search Console, where you want Hugo to copy over a
complete HTML file without modifying its content.

