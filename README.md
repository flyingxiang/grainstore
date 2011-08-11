Grainstore
===========

Need to simply generate a Mapnik map from a dynamic PostGIS table? 

Grainstore is an opinionated MML builder for _single_ PostGIS tables, views or sql queries that outputs Mapnik XML stylesheets. 

Map styles can be defined in the 'Carto' language. Grainstore also has default styles to get you up and running. Your Carto styles are persisted and mapnik XML output cached (in Redis), making it a good choice for use in map tile servers.

The output of Grainstore is a Mapnik XML stylesheet that you can plug directly into Mapnik or Mapnik based tile server to render a map and interactivity layer.

Grainstore is braindead simple: 1db + 1 table + 1 style =  1 Mapnik XML stylesheet (with 1 layer).


Install
--------
npm install grainstore


Dependencies
------------
* Redis
* libosr (or libgdal)


Additional test dependencies
-----------------------------
* libxml2 
* libxml2-devel


Usage
------

```javascript

var GrainStore = require('grainstore');


// fully default.
var mmls = new GrainStore.MMLStore();
var mmlb = mmls.mml_builder({db_name: 'my_database', table_name:'my_table'});
mmlb.toXML(); // => Mapnik XML for your database with default styles



// custom redis and pg settings.
var mmls = new GrainStore.MMLStore({host:'10.0.0.1'}); 

var render_target = {
  db_name: 'my_db', 
  table_name:'my_tb', 
  sql:'select * from my_tb where age < 100'
}

// see mml_store.js for more customisation detail 
var mapnik_config = {
  Map: {srid: 4326},
  Datasource: {
    user: "postgres",
    geometry_field: "my_geom"
  }   
}

mmlb = mmls.mml_builder(render_target, mapnik_config);
mmlb.toXML(function(err, data){
  console.log(data); // => Mapnik XML of custom database with default style
}); 



// custom styles.
var mmls = new GrainStore.MMLStore();
var mmlb = mmls.mml_builder({db_name: 'my_database', table_name:'my_table'});

var my_style = "#my_table{marker-fill: #FF6600;}"

mmlb.setStyle(my_style, function(err, data){
  if err throw err; // any Carto Compile errors
  
  mmlb.toMML(function(err, data){
    console.log(data) // => Carto ready MML
  }); 
  
  mmlb.toXML(function(err, data){
    console.log(data); // => Mapnik XML of database with custom style
  }); 
  
  mmlb.getStyle(function(err, data){
    console.log(data); // => "#my_table{marker-fill: #FF6600;}"
  });
});
```

For more examples, see the tests.


TODO
-----
multilayer api ;)
make storage pluggable
Fix init lag in mml_builder