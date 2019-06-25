/*
 *  This file is part of SYZOJ.
 *
 *  Copyright (c) 2016 Menci <huanghaorui301@gmail.com>
 *
 *  SYZOJ is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  SYZOJ is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public
 *  License along with SYZOJ. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

let Sequelize = require('sequelize');
let db = syzoj.db;

let User = syzoj.model('user');

let model = db.define('team', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING(80), unique: true }//,
  //contest_id: { type: Sequelize.INTEGER },
  //user_id: { type: Sequelize.INTEGER }
}, {
    timestamps: false,
    tableName: 'team',
    indexes: [
      {
        fields: ['name'],
        unique: true
      }
    ]
  });

let Model = require('./common');
class Team extends Model {
  static async create(val) {
    return Team.fromRecord(Team.model.build(Object.assign({
      name:''
    }, val)));
  }
  
  getModel() { return model; }
}

Team.model = model;

module.exports = Team;
