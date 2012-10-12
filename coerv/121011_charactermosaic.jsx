﻿main();function main () {        /*** create document ***/        var phw = 200; // variable that holds the width/height of the page    var doc = app.documents.add();    doc.documentPreferences.pageWidth = phw;    doc.documentPreferences.pageHeight = phw;    doc.documentPreferences.facingPages = false;    var page = doc.pages.item(0);    /*** create swatches for the first textframe ***/    var colors1 = new Array(); // array that holds the swatches    var colors2 = new Array(); // another that holds the swatches    var section = 5;    for(var i=0; i<section; i++){            var my_color = doc.colors.add();                        var R = Math.random() * 255;            var G = Math.random() * 255;            var B = Math.random() * 10;                        // determine the brightness of the color            my_color_brightness = R + G + B;                        my_color.name = "helligkeit" + my_color_brightness;            my_color.model = ColorModel.PROCESS;            my_color.space = ColorSpace.RGB;            my_color.colorValue = [R,G,B];                        colors1.push({"color": my_color,"name":my_color.name,"brightness":my_color_brightness});            colors2.push({"color": my_color,"name":my_color.name,"brightness":my_color_brightness});                }//Now lets sort these colors with our custom sort function below the main functioncolors1.sort(custom_compare);colors2.sort(compare_customly);/*** create textframe ***/var topLeft = 0 + 10; // variable that holds the xy-coordinates of the upper-left corner of the textframevar rightBottom = phw - 10; // variable that holds the xy-coordinates of the bottom-right corner of the textframe// format textvar myfont = app.fonts.item("Delicious"+"\t"+"BoldItalic");  /* A font by Jos Buivenga (exljbris) -> www.exljbris.com */// create textframevar tf = page.textFrames.add({        geometricBounds: [topLeft, topLeft, rightBottom, rightBottom],        contents: 'a'    });var firstChar = tf.characters.firstItem();    firstChar.appliedFont = myfont;    firstChar.leading = 8;        tf.contents = TextFrameContents.PLACEHOLDER_TEXT;/*** Apply colour to the characters ***/var chars = tf.characters; // all charactersfor(var j = 0; j <= (chars.length-section); j = j + section){for(var k=0; k < section; k++){$.writeln("Character: " + (j + k) + " apply Swatch: " + k);chars[j+k].fillColor = colors1[k].color;}}/*** Duplicate layer ***/var originalLayer = doc.layers.item(0); // get the first layervar duplicatedLayer = originalLayer.duplicate(); // duplicate the existing layeroriginalLayer.name = "Outer Shape"; // rename original layerduplicatedLayer.name = "Inner Shape"; // rename duplicated layer/*** Apply colour to the characters on the duplicated layer***/    var dup_tf = page.textFrames.item(1); // get textframe on duplicated layervar dup_chars = dup_tf.characters; // all charactersfor(var l = 0; l <= (dup_chars.length-section); l = l + section){for(var m=0; m < section; m++){$.writeln("Character: " + (l + m) + " apply Swatch: " + m);dup_chars[l+m].fillColor = colors2[m].color;}}/*** create cutout-shape ***/var cutout_topLeft = 0 + 20; // variable that holds the xy-coordinates of the upper-left corner of the textframevar cutout_rightBottom = phw - 20; // variable that holds the xy-coordinates of the bottom-right corner of the textframe// create textframevar cutout_tf = page.textFrames.add({        geometricBounds: [cutout_topLeft, cutout_topLeft, cutout_rightBottom, cutout_rightBottom],        contents: 'a'    });cutout_tf.paragraphs.item(0).properties = {    pointSize: 10,    justification : Justification.CENTER_ALIGN,}cutout_tf.paragraphs.item(0).appliedFont = myfont;var cutout_shape = cutout_tf.createOutlines(true); // convert text to outlinesvar the_shape = cutout_shape[0];var cutout_bounds = the_shape.geometricBounds; // get the bounds of the firstvar coutout_top_y = cutout_bounds[0];var coutout_bottom_y = cutout_bounds[2];var cutout_height = coutout_bottom_y - coutout_top_y;var cutout_height_new = phw - 20;var cutout_scalefactor = ((100/cutout_height)*cutout_height_new)/100;//alert("cutout_scalefactor " + cutout_scalefactor);var cutout_bounds_new = new Array();for (var n=0; n<cutout_bounds.length; n++) {    cutout_bounds_new[n] = cutout_bounds[n] * cutout_scalefactor;};the_shape.geometricBounds = cutout_bounds_new;the_shape.fillColor = doc.swatches.item(0);// center the polygon align expects an arraydoc.align(cutout_shape, DistributeOptions.HORIZONTAL_CENTERS, AlignDistributeBounds.PAGE_BOUNDS);doc.align(cutout_shape, DistributeOptions.VERTICAL_CENTERS,AlignDistributeBounds.PAGE_BOUNDS);/*** Paste duplicated textframe into cutout-shape ***/dup_tf.select();app.cut();the_shape.select();app.pasteInto ();}/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!this is deep Javascript Stuffyou can write your custom comparatorread this Stackoverflow posthttp://stackoverflow.com/questions/1129216/sorting-objects-in-an-array-by-a-field-value-in-javascript*/function custom_compare(a,b) {  if (a.brightness < b.brightness)     return -1;  if (a.brightness > b.brightness)    return 1;  return 0;}function compare_customly(a,b) {  if (a.brightness > b.brightness)     return -1;  if (a.brightness < b.brightness)    return 1;  return 0;}