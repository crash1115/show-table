import { libWrapper } from './scripts/libwrapper-shim.js'

// Patch the RolLTableConfig getHeaderButtons method
Hooks.once('setup', function () {
  libWrapper.register(
    'show-table',
    `foundry.applications.sheets.RollTableSheet.prototype._getHeaderControls`,
    addShowToPlayersBtn,
    'WRAPPER',
  )
})

// Set up socket handler
Hooks.once('ready', function () {
  game.socket.on('module.show-table', async (data) =>{
    game.tables.get(data.tableId).sheet.render(true);
  });
})

// Add a button
function addShowToPlayersBtn(wrapped){
  const buttons = wrapped.bind(this)()
  let id = this.document.id;
  if(game.user.isGM){
    // Add the button
    buttons.unshift({
      action: "showTableToPlayers",
      label: 'Show Players',
      icon: 'far fa-eye',
      visible: game.user.isGM
    });
    // Add the action
    this.options.actions.showTableToPlayers = async (ev) => {
      return game.socket.emit('module.show-table', {tableId: id})
    };
  }
  return buttons;
}


