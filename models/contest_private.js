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


let model = db.define('contest_private', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  is_private: { type: Sequelize.BOOLEAN },
  password: { type: Sequelize.STRING(120) }
}, {
  timestamps: false,
  tableName: 'contest_private'
});

let Model = require('./common');
class ContestPrivate extends Model {
  static async create(val) {
    return ContestPrivate.fromRecord(ContestPrivate.model.build(Object.assign({
      is_private: false,
      password: ''
    }, val)));
  }
  getModel() { return model; }
}
ContestPrivate.model = model;

module.exports = ContestPrivate;
