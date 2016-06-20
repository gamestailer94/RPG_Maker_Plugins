/*:
 * @plugindesc Adds Extra Elements to Settings Menu, requires Yanfly Battle System Core
 * @author Gamestailer94
 *
 * @param Difficulty Variable
 * @desc Variable used For Difficulty
 * @default 1
 *
 * @param --------
 *
 * @param Difficulty Word
 * @desc Word for Difficulty
 * @default Difficulty
 *
 * @param Easy Word
 * @desc Word for Easy
 * @default Easy
 *
 * @param Medium Word
 * @desc Word for Medium
 * @default Medium
 *
 * @param Hard Word
 * @desc Word for Hard
 * @default Hard
 *
 * @param Battle Style Word
 * @desc Word for Battle Style
 * @default Battle Style
 *
 * @param ATB Word
 * @desc Word for... (you know what)
 * @default ATB
 *
 * @param CTB Word
 * @default CTB
 *
 * @param DTB Word
 * @default DTB
 */

var GSScripts = GSScripts || {};
GSScripts["Config"] = GSScripts["Config"] || {};
GSScripts["Config"]["ExtraSettings"] = PluginManager.parameters("GS_ExtraSettings");

// -----------------------------
// Window_Options
//------------------------------

GS_Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
GS_Window_Options_processOk = Window_Options.prototype.processOk;
GS_Window_Options_statusText = Window_Options.prototype.statusText;
GS_Window_Options_cursorRight = Window_Options.prototype.cursorRight;
GS_Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;

Window_Options.prototype.makeCommandList = function() {
    this.addExtraCommands();
    GS_Window_Options_makeCommandList.call(this);
};

Window_Options.prototype.addExtraCommands = function(){
    this.addCommand(GSScripts["Config"]["ExtraSettings"]["Difficulty Word"], "difficulty");
    this.addCommand(GSScripts["Config"]["ExtraSettings"]["Battle Style Word"], "battleStyle");
};

Window_Options.prototype.processOk = function(){
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if(symbol != "difficulty" && symbol != "battleStyle") {
        GS_Window_Options_processOk.call(this);
    }else if (symbol === "difficulty"){
        this.changeDifficulty('up',false);
    }else if(symbol === "battleStyle"){
        this.changeBattleSys('up',false);
    }
};

Window_Options.prototype.cursorRight = function(wrap){
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if(symbol != "difficulty" && symbol != "battleStyle") {
        GS_Window_Options_cursorRight.call(this);
    }else if (symbol === "difficulty"){
        this.changeDifficulty('up',true);
    }else if(symbol === "battleStyle"){
        this.changeBattleSys('up',true);
    }
};

Window_Options.prototype.cursorLeft = function(wrap){
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if(symbol != "difficulty" && symbol != "battleStyle") {
        GS_Window_Options_cursorLeft.call(this);
    }else if (symbol === "difficulty"){
        this.changeDifficulty('down',true);
    }else if(symbol === "battleStyle"){
        this.changeBattleSys('down',true);
    }
};

Window_Options.prototype.changeDifficulty = function(state,max){
    var value = $gameVariables.value(GSScripts["Config"]["ExtraSettings"]["Difficulty Variable"] || 1) || 1;
    if(state == 'up'){
        if(value < 3)
            value++;
        else if(!max)
            value = 1;
    }else if(state == 'down'){
        if(value > 1)
            value--;
        else if(!max)
            value = 3;
    }
    $gameVariables.setValue(GSScripts["Config"]["ExtraSettings"]["Difficulty Variable"] || 1, value);
    this.redrawItem(this.findSymbol("difficulty"));
};

Window_Options.prototype.changeBattleSys = function(state,max){
    var types = ['atb','ctb','dtb'];

    var battleSys = $gameSystem.getBattleSystem();
    for(var i = 0; i < types.length; i++){
        if(types[i] == battleSys)
            var activeType = i;
    }
    if(state == 'up'){
        if(activeType < types.length-1)
            activeType++;
        else if(!max)
            activeType = 0;
    }
    if(state == 'down'){
        if(activeType > 0)
            activeType--;
        else if(!max)
            activeType = 2;
    }
    $gameSystem.setBattleSystem(types[activeType]);
    this.redrawItem(this.findSymbol("battleStyle"));
};

Window_Options.prototype.statusText = function(index){
    var symbol = this.commandSymbol(index);
    if(symbol !== "difficulty" && symbol !== "battleStyle") {
        return GS_Window_Options_statusText.call(this, index);
    }else if(symbol === "difficulty"){
        var difficultly = $gameVariables.value(GSScripts["Config"]["ExtraSettings"]["Difficulty Variable"] || 1);
        switch (difficultly) {
            case 1:
            default:
                return GSScripts["Config"]["ExtraSettings"]["Easy Word"];
                break;
            case 2:
                return GSScripts["Config"]["ExtraSettings"]["Medium Word"];
                break;
            case 3:
                return GSScripts["Config"]["ExtraSettings"]["Hard Word"];
                break;
        }
    }else if(symbol === "battleStyle"){
        var battleSys = $gameSystem.getBattleSystem();
        switch(battleSys){
            case 'dtb':
            default:
                return GSScripts["Config"]["ExtraSettings"]["DTB Word"];
                break;
            case 'ctb':
                return GSScripts["Config"]["ExtraSettings"]["CTB Word"];
                break;
            case 'atb':
                return GSScripts["Config"]["ExtraSettings"]["ATB Word"];
                break;
        }
    }
};