
# ESDoc Options

Options are one of the important part of ESDoc, next to parsing code and generating output. If everything works
perfectly, user shouldn't ever hear about config and if everything is breaking down, user should have as much
help given by options system as possible. This isn't possible without more complex system.

## Why?

Ideally, if there is an issue, we want to give user the most information with possible fix hint:

esdoc.json
{
  debug: "1"
}

Error:
esdoc.json line 2:
  debug: "1"
         ^^^
debug requires boolean value, but string was found!

esdoc.json:
{
  source: ["src", 5]
}

Error:
esdoc.json line 2:
  source: ["src", 5]
                  ^
source is an array of paths, but a number was found!
Please put paths in quotes.

esdoc.json:
{
  ...
}

Error:
esdoc.json:
destination option is required, but it's value is not found.
Please put destination: "docs" to your config file or pass it as an --destination "docs" option when running esdoc.

## How?

We divide the system into three parts:

|         |                   |              |
|         |   ESDoc/Plugin    |              |
| Options |     Options       | Option types |
|         | Schema definition |              |
|         |                   |              |

Which corresponds to:

|                |                                 |
| {              |                                 | boolean type
|   debug: true  | expect "debug" which is boolean |
| }              |      default value false        | values: true/false, no string, no number
|                |                                 |

User provides config
                 Developer provides options schema
                                                   Javascript/ESDoc/Plugin provides type definition and validation

### Why? Use something existing

That is possibility. We already use a tool to parse arguments so why not options too? Well, to have more control.
To validate options at the ESDoc level. To allow plugins to tell ESDoc what config options they expect. To tell
user what is wrong. To not rely on javascript's type coercion.

### That's stupid and too complex

I respect your opinion. I want to do it, be it an experience of how not to do things or having success when it
doesn't work just in my head but in reality too. However the chance you are even reading this text is 00.01%
if I did it right and it doesn't need fixing or reworking. In the other 99.99% chance you have to read this - sorry.

## Terms

Let's define some terms so we can speak the same language:

Options | ProcessedOptions | RawOptions
OptionItem
ESDocOptions | PluginOptions
OptionsSchema
OptionType
ValueProcessor

Hopefully these names are self explanatory, I've gone through many variations of these...

### Options

These are the options either given as options to esdoc when running it, eg. --source "src", or by having a config file:

esdoc.json
{
  source: "src",
  destination: "docs",
  plugins: {
    manual:
      index: "MANUAL.MD"
  }
}

#### RawOptions

These are the options, unvalidated, coming directly from user as input. Our "mission" is to validate these, tell
user if anything is wrong and transform these to ProcessedOptions, ready to be used by ESDoc/Plugins.

#### ProcessedOptions

These are the validated and processed options ESDoc/Plugins told us they expect through OptionsSchema. They can be
sure they have what they expect and in the correct format, if needed. NOTE: invalid values won't be found here as
invalid values were not/couldn't be correctly processed. But if that happens, the config system should bring attention
to user that something is wrong and ESDoc/Plugins shouldn't find themselves in unexpected state.

### OptionItem

RawOptions:
esdoc.json
{
  source: "src",
  destination: "docs",
  debug: true
}

Will be transformed to:

ProcessedOptions:
{
  source: ["src"],
  sources: ["src"],
  dest: "docs",
  destination: "docs",
  debug: true,
  verbose: true
}

Producing four OptionItems:
pseudocode:
1: ["source", "sources"]: ["src"]
2: ["dest", "destination"]: "docs"
3: "debug": true
4: "verbose": true

What the hell that means? The "source" and "sources" are name/alias for the same option item:
Ask option system for "source", you get an array with one element "src".
Ask for "sources", you get the exact value of an array with one element "src".
Ask for "dest", you get a string with "docs".
Ask for "destination", and again you will get the exactly same value of "docs" string.
Ask for "debug", you get a boolean value of true.
Ask for "verbose", and you get true, even if we didn't really set it - why though?

It's the option system and OptionItem underneath the ground which does that for you. You don't need to think about it,
you just tell ESDoc through schema what you want to be available, and it will provide it for you:
You say "source" and "sources" are aliases for the same option and should have the same value - here you go.
You say you expect an array of paths and user gave just a single string? No problem, we will give you an array with
one element, because you told us in schema you want that and we allow user to enter just a single element to make it
easier for the user.
Why is there "verbose" option value, even if user didn't specify it? That's thanks to "debug". It's logical if user
use debug level, verbose is kinda implicitly included. So it will be explicitly added as an option for situations
where output to user is done if verbose level is set.

### ESDocOptions/PluginOptions

While they are interwoven and mixed together, we still need to make a little distinction between these two parts.

ESDocOptions is the global config effective for whole ESDoc environment. The core ESDoc AND plugins must take it into
account when operating, like verbose and debug options.

PluginOptions are then options specifically for that individual plugin. You are given global options and plugin options
as a developer of plugin.

In options file the global ESDoc options are in root object, and PluginOptions are under plugins with a name of plugin
to which they belong to:

esdoc.json
{
  debug: true, // global option
  plugins: [
    "esdoc-integrate-manual-plugin": {
      index: "MANUAL.MD" // option only for esdoc-integrate-manual-plugin
    }
  ]
}

### OptionsSchema

So how do we tell ESDoc what options we want from user or give to user to choose from?
There are many schema like syntaxes and definitions but I chose to make one which is
not too complex - we don't need namespaces etc. - but can give us chance to validate
or transform values without developer to think too much about how to do that.

As developer you define an array of OptionTypes you want:

OptionsSchema:
[
  OptionType,
  OptionType,
  OptionType
]

ESDoc options system takes this schema, get raw options from user, do it's magic of validation and transformation and
you can ask it for your options.

### OptionType

Of course we start with the simple and then some more complex:
boolean
number
string
array
list
path
object
ESDocPluginOptions

#### type

We can use the name of the type to differentiate among them:
**{ type: "** boolean **" }**
**{ type: "** number **"}**
...
**{ type: "** object **" }**
**{ type: "** ESDocPluginOptions **" }**

#### name

Without a name the option wouldn't be much of use for us, so let's add names:
{ **name: "debug",** type: "boolean" }
{ **name: "source",** type: "array" }
{ **name: "package.json",** type: "path" }
{ **name: "esdoc-integrate-manual-plugin",** type: "ESDocPluginOptions" }

#### isRequired

Sometimes we just need the value to be able to do our work - without the source directory we are useless:
{ name: "debug", type: "boolean" }
{ name: "source", type: "array"**, isRequired: true** }
{ name: "package.json", type: "path"**, isRequired: false** }
{ name: "esdoc-integrate-manual-plugin", type: "ESDocPluginOptions" }

#### defaultValue

For some options we don't require user to explicitly tell us what the value should be:
{ name: "debug", type: "boolean"**, defaultValue: false** }
{ name: "source", type: "array", isRequired: true }
{ name: "package.json", type: "path", isRequired: false**, defaultValue: "./package.json"** }
{ name: "esdoc-integrate-manual-plugin", type: "ESDocPluginOptions" }

#### alias

Some option names make sense in single, some in plural, other tool use this name while another tool use that name which
means the same, so user might expect both forms to be available in ESDoc, or you just want to have a common coding
standard for variable naming, so let's add aliases:

{ name: "debug", type: "boolean", defaultValue: false }
{ name: "source", type: "array", isRequired: true **, alias: ["sources"]** }
{ name: "package.json", type: "path", isRequired: false, defaultValue: "./package.json" **, alias: ["package"]** }
{ name: "esdoc-integrate-manual-plugin", type: "ESDocPluginOptions" }

Wait - alias or aliases? How about an alias for aliases? Name: "alias", alias: ["aliases"]? Well, why not...

### BaseType

So these are the basic properties our type will need:
type
name
alias(es)
isRequired
defaultValue

type is always required. Without it the definition would be meaningless.
name should probably be set too, though there might? be a case where it is not needed?
alias(es) might be null if no aliases were set...
isRequired should be either true or false
defaultValue should be set or null.

type - string, required, should be one of "boolean", "bool", "number", "string", etc. no unknown (unregistered) type
name - string, or null
alias(es) - string or array of string(s), or null
isRequired - true/false boolean
defaultValue - value provided by plugin developer, or null

Let's add some helper functions:
getAllNames() - returns array with name and aliases, so eg. ["source", "sources"]
hasName(string) - returns true/false boolean if OptionType has that string as a name or alias
hasDefaultValue() - returns true/false boolean if OptionType has a defaultValue set

Validation should be if the value provided by user is of the correct javascript type.

### ArrayType

Useful for telling ESDoc the source directories:
sources: ["src", "vendor/mine"]

#### ofType

We need to tell through schema what type of elements is expected. This time we expect paths:
{ name: "sources", alias: "source", type: "array"**, ofType: "path",** isRequired: true, defaultValue: "src" }

But what if user forgets to provide an array?

esdoc.json
{
  sources: "src"
}

We expect to have an array of path elements, so ESDoc options system needs to transform the value somehow to an array
of paths... On that topic more below. // TODO: provide link.

This gives us
{
  source: ["src"],
  sources: ["src"]
}
which is what we expect and we can be happy.

Validation should check if every element is of correct type, including the default value elements, if specified.

### ESDocPluginOptions

This is in other words an object with a name or alias/aliases or alternative names where user defines options of
that plugin. Don't think about it too much. You will be given these options and the implementation is done
through this type. Not recommended using it yourself though...

Validation still happens for every item in the object.

### Object

If you cannot find a suitable OptionType, you can always write your own and register it with ESDoc OptionsManager.
ESDoc will then recognize it and feed it to your type to deal with it.

**Don't forget every item should be validated.**

### List

List can provide predefined list of values user can choose from:
access: ["public", "protected", "private"]

User can specify one, or all of these options.

#### possibleValues

Defines which values are available to choose from:
{ name: "access", type: "list"**, possibleValues: ["public", "protected", "private"],** defaultValue: ["public"] }

Possible values and default value should be validated if they are of correct type.

### Path

When dealing with paths we might want to have a common format for path, be it posix or win. Wouldn't that be great?
But how we would do it?

## Transform

To make path in same format and not to have deal with ".//some//path" or ".\some\path\" or whatever, to have in
config file source: "src" and receive source: ["src"], to do that we might need to somehow transform that value.

### ArrayTransform

So we tell ESDoc options system we expect an array, of paths, and if it's not set, to give us default value:
{ name: "sources", alias: "source", type: "array", ofType: "path", isRequired: true, defaultValue: "src" }

Then when we ask option system for source we receive ["src"]. How should that work?

We have an ArrayTransform which does that behind the curtains
(not real order of execution, eg. schema is read before config from file):

ESDoc loads OptionsSchema, finds there is option named "source" of ArrayType.
(validation of schema and defaultValue happens)
ESDoc loads raw options.
ESDoc finds "source".
ESDoc looks up "source", finds it should be an ArrayType.
The "source" ArrayType is given the value from user.
(validation of value happens)
ArrayType calls ArrayTransform, giving it the value.
ArrayTransform takes the string, adds it to an array, stores value as an array.
PathTransform is called somewhere here too, since it's array of paths...
Everything is now ProcessedOptions
Asking ESDoc options system gives us the ["src"] value.

Again, for you as a plugin developer, all you need is to tell ESDoc config system you want an array of paths and then
use it as an array of paths. The ESDoc config system does all the validation and transformation under the hood.

### PathTransform

Makes sure all paths are in common format. Using [uPath|https://www.npmjs.com/package/upath] to normalize paths. Works
with string.

### ListTransform

Might be an array transform behind curtains just checking if values are the possible values. Who knows?

### CustomTransform

In case you write your own OptionType, you probably want to write your own Transform too. You can use any of existing
too to compose what you need. All that is expected is to return a value according to OptionType Schema definition.

## TL;DR

ESDoc and plugins' developers specify their OptionsSchema:
[
  { name: "sources", alias: "source", type: "array", ofType: "path", isRequired: true, defaultValue: "./src" },
  { name: "destination", alias: "dest", type: "path", isRequired: true, defaultValue: "./docs" }
  { name: "debug", type: "boolean", defaultValue: false }
  { name: "verbose", type: "boolean", defaultValue: false }
  { name: "plugins", type: "array", ofType: "ESDocPluginOptions" }
]

esdoc-integrate-manual-plugin Schema:
{
  name: "esdoc-integrate-manual-plugin",
  alias: "manual",
  options: [
    { name: "index", type: "path", isRequired: false, defaultValue: "INDEX.MD" }
  ]
}

User tells us what she wants with options, for example in a config file:

esdoc.json
{
  source: "src",
  destination: "docs",
  debug: false,
  verbose: true,
  plugins: [
    "esdoc-integrate-manual-plugin": {
      index: "MANUAL.MD"
    }
  ]
}

ESDoc loads schemas from ESDoc/Plugins.
ESDoc loads config from user.
Each option defined in schema is checked and transformed to value.
You can ask ESDoc option system for option value.

## More info

How ESDoc treats config options?

ESDoc bin is executed - arguments are transformed to (raw) options.
ESDoc bin loads config file, if it exists and added to (raw) options.
ESDoc generate(options) is called with (raw) options passed. Contains both global and plugins' options.
ESDoc options system gets ESDocOptionsSchema, creates and validates all OptionTypes for global options.
  Any ESDocOptionsSchema definition error would be reported at this moment.
ESDoc emits onGetOptionsSchema event to get PluginOptionsSchema from plugins.
ESDoc options system creates and validates OptionTypes for each plugin.
  Any PluginOptionsSchema definition error would be reported at this moment.
ESDoc options system is given raw options.
Every OptionType is matched to raw option and its value passed to it.
OptionType validates the value it was passed and transforms it if necessary.
Any unmatched value is reported.
ESDoc emits onOptionsLoaded even where plugin can read/change options.

### As a plugin developer, how to give ESDoc the OptionsSchema?

ESDoc will ask you for schema by emitting onGetOptionsSchema event. Return an object:

{
  name: "esdoc-integrate-manual-plugin",
  alias: ["manual", "fancy-manual"],
  options: [
    { name: "index", type: "path", defaultValue: "index.md" }
  ]
}

#### name (required)

It specifies how your plugin is named. I know, I should read it from package.json of the plugin. Maybe one day...
Anyway. This will be the name under which ESDoc will be looking for your plugin's options:

Schema
{
  **name: "esdoc-integrate-manual-plugin"**
}

corresponds to:
esdoc.json
{
  ...
  "plugins": [
    "esdoc-integrate-manual-plugin": {
      ...
    }
  ]
}

NOTE:
To allow custom esdoc build, plugins names are treated differently that in original ESDoc:

You can specify full name: "@enterthenamehere/esdoc-integrate-manual-plugin"
This means that specifically this plugin from this author will be required (not fully tested).

You can specify plugin name, without scope: "esdoc-integrate-manual-plugin" **(recommended)**
This ESDoc version will check what scope, if any, is released under, and will add that scope to the name
of the plugin - eg. @enterthenamehere will be added, making it "@enterthenamehere/esdoc-integrate-manual-plugin"
and correct plugin is found even without the scope present. For backwards compatibility, otherwise it would
break plugin usage as updated plugins wouldn't be found.

Plugin name can be specified without the "esdoc-" and "-plugin" part too: "integrate-manual" still points to the correct
plugin "esdoc-integrate-manual-plugin". This helps with "brand" or other plugin names.

#### alias (optional)

Together with name, an alias(es) can be specified:
Schema
{
  name: "esdoc-integrate-manual-plugin"**,**
  **alias: "manual"**
}

It kinda makes sense that user can simply want to call "esdoc-integrate-manual-plugin" simply "manual". With alias,
it's possible to tell ESDoc that any options under that "manual" name belongs to "esdoc-integrate-manual-plugin".

#### options (optional)

The most important part - an array of OptionTypes:

Schema
{
  name: "esdoc-integrate-manual-plugin",
  alias: "manual"**,**
  **options: [**
    ...
  **]**
}

It's not required, you wouldn't get any options from ESDoc other than those global like debug and verbose though.
Sometimes you just don't need any options to be able to work...

name is still required though, because user tells ESDoc she wants to use your plugin, even if no options are passed
with it:
esdoc.json
{
  ...,
  "plugins: [
    "esdoc-integrate-manual-plugin"
  ]
}

#### Different ways user can give options in "plugins"

Yes, user can use multiple ways to pass options to your plugin:

esdoc.json
{
  ...
  "plugins": [
    "esdoc-integrate-manual-plugin" // only name, no options
  ]
}

esdoc.json
{
  ...
  "plugins": [
    [ "esdoc-integrate-manual-plugin" ] // an array, just name, no options
  ]
}

esdoc.json
{
  ...
  "plugins": [
    [ "esdoc-integrate-manual-plugin", { index: "MANUAL.MD" } ] // an array, with name, and with options as object
  ]
}

esdoc.json
{
  ...
  "plugins": [
    { // an object
      name: "esdoc-integrate-manual-plugin", // with name
      options: { // and explicit options object
        index: "MANUAL.MD"
      }
    }
  ]
}

esdoc.json
{
  ...
  "plugins": {
    "esdoc-integrate-manual-plugin": { // a property of object, using plugin's name as the name of property...
      index: "MANUAL.MD" // ... specifying the options
    }
  }
}

esdoc.json
{
  ...
  "plugins": {
    "esdoc-integrate-manual-plugin": {
      "options": {
        index: "MANUAL.MD" // OK, now you are just making fun of me...
      }
    }
  }
}

esdoc.json
{
  ...
  "plugins": [
    {
      "esdoc-integrate-manual-plugin": {
        index: "MANUAL.md" // Common, we already went through arrays!
      }
    }
  ]
}

esdoc.json
{
  ...
  "plugins: [
    {
      "esdoc-integrate-manual-plugin": {
        "options": {
          index: "MANUAL.md" // Are you trying to piss me off?
        }
      }
    }
  ]
}

Ok, some of these are with "might explode" warning sticker, but what is important for you as the developer of plugin
is that when you ask ESDoc config system for an option value, you get that option value. Or at least user is notified
about what the fu...

#### What types can I use?

// TODO: add links when complete
BooleanType,
NumberType,
StringType,
ArrayType,
PathType,
ListType,
ESDocPluginOptions (not recommended for use, used by ESDoc internally),
ObjectType (you might want to create your own type instead)
