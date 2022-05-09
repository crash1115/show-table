import { libWrapper } from './scripts/libwrapper-shim.js'

// Patch the RolLTableConfig getHeaderButtons method
Hooks.once('setup', function () {
  libWrapper.register(
    'show-table',
    `RollTableConfig.prototype._getHeaderButtons`,
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
  let id = this.object.id;
  if(game.user.isGM){
    buttons.unshift({
      label: 'Show Players',
      class: 'show-table',
      icon: 'far fa-eye',
      onclick: async ev => {
        return game.socket.emit('module.show-table', {tableId: id})
      },
    })
  }
  return buttons;
}


