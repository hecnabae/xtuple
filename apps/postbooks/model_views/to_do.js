// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

sc_require('views/carousel');
sc_require('views/tile_view');

var base03 =   "#002b36";
var base02 =   "#073642";
var base01 =   "#586e75";
var base00 =   "#657b83";
var base0 =    "#839496";
var base1 =    "#93a1a1";
var base2 =    "#eee8d5";
var base3 =    "#fdf6e3";
var yellow =   "#b58900";
var orange =   "#cb4b16";
var red =      "#dc322f";
var magenta =  "#d33682";
var violet =   "#6c71c4";
var blue =     "#268bd2";
var cyan =     "#2aa198";
var green =    "#859900";
var white =    "white";

Postbooks.ToDo = {};

Postbooks.ToDo.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var contact = object.getPath('contact.name');
  var assignedTo = object.getPath('assignedTo.username');
  
  // Rect
  context.fillStyle = isSelected? '#99CCFF' : 'white';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'grey';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, height - 0.5);
  context.lineTo(width, height - 0.5);
  context.stroke();
  
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  
  // Due Date
  var dt = object.get('dueDate');
  var dateWidth = 0;
  if (dt) {
    val = dt.toLocaleDateString();
    var isDue = object.get('isActive') &&
                XT.DateTime.compareDate(dt, XT.DateTime.create()) <= 0;
    context.font = "10pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 315, 15);
    dateWidth += context.measureText(val).width + 5;
  }
  
  // Name
  val = object.get('name');
  context.font = (val? "bold " : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'left';
  val = val.elide(context, 295 - dateWidth);
  context.fillText(val? val : "_noName".loc(), 15, 15);
  
  // Description
  val = object.get('description');
  context.font = "9pt "+K.TYPEFACE;
  if (val && contact) val = val.elide(context, 290);
  context.fillText(val , 15, 35);

  // Account Name
  val = object.getPath('account.name');
  context.font = "italic 9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  val = val? val.elide(context, 160) : null;
  context.fillText(val? val : "_noAccountName".loc() , 325, 15);

  // Contact Name
  val = contact;
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  val = val? val.elide(context, 160) : '';
  context.fillText(val, 325, 35);

  // Status
  val = object.get('toDoStatusString');
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noStage".loc(), 490, 15);
  
  // Assigned To
  val = assignedTo || '';
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.fillText(val , 490, 35);  

  // Priority
  val = object.getPath('priority.name');
  var emphasis = object.getPath('priority.order')<=1? "bold " : "";
  context.font = (val? emphasis : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? black : base1;
  context.fillText(val? val : "_noPriority".loc(), 565, 15);

};

Postbooks.ToDo.Tiles = function(controller, isRoot) {
  console.log('Postbooks.ToDo.Tiles()');
  
  var klass = XM.ToDo,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // Overview
  properties = 'name isActive description priority owner assignedTo'.w()
  tiles.push(Postbooks.CreateTileView(klass, controller, undefined, properties));
  
  // Dates
  properties = 'toDoStatus startDate dueDate assignDate completeDate'.w()
  tiles.push(Postbooks.CreateTileView(klass, controller, "_status".loc(), properties));
  
  // Notes
  tiles.push(Postbooks.CreateNotesTileView(controller));

  return tiles;
};



