module.exports = getTableService = getTableService;

function TableService() {
	this.tables = {};
	this.instance = null;
}

TableService.prototype.addTable = function(table){
	// store table to database
	this.tables[table.id] = table;
}
TableService.prototype.getTable = function(id){
	return this.tables[id];
}
var tableService = null;
function getTableService(){
	if(tableService){
		return tableService;
	}else{
		tableService = new TableService();
		return tableService;
	}
}