function roomNameToXY(name) {

    name = name.toUpperCase();

    var match = name.match(/^(\w)(\d+)(\w)(\d+)$/);
    if(!match) {
        return [undefined, undefined];
    }
    var [,hor,x,ver,y] = match;

    if(hor == 'W') {
        x = -x-1;
    }
    else {
        //x--;
        x = +x;
    }
    if(ver == 'N') {
        y = -y-1;
    }
    else {
        //y--;
        y = +y;
    }
    return [x,y];
};

/**
 * Exit counts for every accessible room.
 * @constructor
 * @param {Array.<string>} accessibleRooms List of room names.
 * @param {Object.<string, Array.<number>>} staticTerrainData Terrain data for
 *     each room.
 */
function WorldMapGrid(accessibleRooms, staticTerrainData) {
    /**
     * Number of exits in each direction for every room.
     */
    this.gridData = this._buildGridData(
            accessibleRooms, staticTerrainData);
}

/**
 * Build and return the grid data.
 * @private
 * @param {Array.<string>} accessibleRooms List of room names.
 * @param {Object.<string, Array.<number>>} staticTerrainData Terrain data for
 *     each room.
 * @return {Object.<string, Object.<string, number>>} The number of exits in
 *     each direction for every room, if any.
 */
WorldMapGrid.prototype._buildGridData = function(
        accessibleRooms, staticTerrainData) {
    if (!accessibleRooms) return {};
    const dirs = {
        t: {
            startx: 0,
            starty: 0,
            dx: 1,
            dy: 0,
        },
        r: {
            startx: 49,
            starty: 0,
            dx: 0,
            dy: 1,
        },
        b: {
            startx: 0,
            starty: 49,
            dx: 1,
            dy: 0,
        },
        l: {
            startx: 0,
            starty: 0,
            dx: 0,
            dy: 1,
        },
    };
    let gridData = {};
    for (let roomName of accessibleRooms) {
        let [x, y] = roomNameToXY(roomName);
        let terrain = staticTerrainData[roomName];
        let roomData = {};
        for (let dirName in dirs) {
            let {startx, starty, dx, dy} = dirs[dirName];
            let curx = startx;
            let cury = starty;
            let numExits = 0;
            for (let i = 0; i < 50; ++i) {
                if (terrain[cury * 50 + curx] == 0) {
                    numExits++;
                }
                curx += dx;
                cury += dy;
            }
            if (numExits > 0) {
                roomData[dirName] = numExits;
            }
        }
        gridData[`${x},${y}`] =  roomData;
    }
    return gridData;
}

module.exports = WorldMapGrid;
