<img align="right" width="250px" src="http://openclipart.org/people/FEN/FEN_Bad_hair_day.svg" />

# Nikki

A fast, browser-based IDE written in NodeJS. **For Real**.

Nikki's philosophy embraces the *less is better*, giving
you a smart text editor that lets
you focus on code rather than making you waste your time
waiting for the IDE to boot, to suggest a method or to
scan a new project.

Not to mention, Nikki doesn't need 64GB of RAM to run
a simple "Hello World!" in Java.
l
;-)

## Installation

The recommended way to install nikki is to do it
globally:

```
npm install -g nikki
```

[![ScreenShot](https://raw.githubusercontent.com/odino/nikki/master/bin/images/nikki.png?token=328420__eyJzY29wZSI6IlJhd0Jsb2I6b2Rpbm8vbmlra2kvbWFzdGVyL2Jpbi9pbWFnZXMvbmlra2kuZ2lmIiwiZXhwaXJlcyI6MTQwMzk4MDA4N30%3D--df43445fcfba173ae878bc6447c1169b61bc59cf)](http://www.youtube.com/watch?v=i-Ez4Jz67yg&feature=youtu.be)

## Usage

Once you have it installed globally you can simply
start nikki from the command line:

```
nikki
```

This command will open your browser at `http://localhost:9123/`,
where the IDE is running.

To open specific project, simply specify it in the URL, for
example `http://localhost:9123/home/odino/my-project`.

If you wish to start nikki on another port, simply specify it
once you start the IDE:

```
nikki --port
```

By default, nikki opens on the directory from which it was launched,
which means that:

```
cd /tmp

nikki
```

will open the browser at `http://localhost:9123/tmp`

If you feel lost, simply run a `nikki --help` and get some comfort.

## Configuration

By default, nikki comes with some configs stored
in the [.nikki.yml](https://github.com/odino/nikki/blob/master/.nikki.yml)
file of the module itself; you can setup custom
configs by storing a `.nikki.yml` file in your home
directory, or in the directory from which you are starting
nikki.

For example, to change the editor theme, you can
create the `.nikki.yml` configuration file in `~`:

```
editor:
  theme: chaos
```

For a full list of available configurations, have
a look [here](https://github.com/odino/nikki/blob/master/.nikki.yml).

If you want to be more granular and specify
per-project configurations, you can do it by
storing another `.nikki.yml` in your project's
folder (ie. `/home/user/projects/test-project/.nikki.yml`):
once you open nikki at `localhost:9123/home/user/projects/test-project`
you will see that you are now using custom configurations
that will only be available on that project.

## Shortcuts

Nikki is thought with shortcuts in mind and focused on letting
you write code without using your mouse.

Here are some of the shortcuts you might find useful
while using it:

* use `up` or `down` to move between files / directories
* press `space` to open a file / directory
* `ctrl + s` will save the current open file
* `ctrl + shift + f` will search files by name in the current directory
* press `ctrl + shift + x` to switch the focus between the filesystem structure
and the editor tab (this is handy when you open a file, save it and then
wanna open another file without using the mouse)

When you are on the editor tab, use your usual shortcuts
(ie. `tab` to indent, `ctrl + z` to undo), as we are using
the [ACE editor](http://ace.c9.io/#nav=about).

## Support

Nikki should work on all modern browser, it's actually
quite good on the latest versions of Chrome and Firefox.

## Development

You can contribute to nikki by simply forking this repo and
running it locally; `cd` into nikki's root, run `npm install`
and `bower install` and launch the app with gulp:

```
git clone git@github.com:odino/nikki.git

cd nikki

npm install

gulp
```

Among the things I wanna add in the next weeks:

* search for files, recursively, from the current dir
* multiple editor tabs
* [tests](http://liamkaufman.com/blog/2012/01/28/testing-socketio-with-mocha-should-and-socketio-client/)

By the way, the layout sucks, **big time**: never been a genious
with HTML and CSS so if you guys wanna come up with something I'd
be super happy.

## License

For the ones who care, nikki is released under the MIT license.

## Are you for real?

"Kinda", "Why not?" and "Let's just have fun" are all valid
answers to this question.

Of course, calling this thing an "IDE" is a bit - well, a lot -
pretentious. On purpose ;-)
