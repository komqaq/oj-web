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
let Problem = syzoj.model('problem');

let model = db.define('contest_player_allow', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  contest_id: { type: Sequelize.INTEGER },
  user_id: { type: Sequelize.INTEGER }
}, {
    timestamps: false,
    tableName: 'contest_player_allow',
    indexes: [
      {
        fields: ['contest_id'],
      },
      {
        fields: ['user_id'],
      }
    ]
  });

let Model = require('./common');
class ContestPlayerAllow extends Model {
  static async create(val) {
    return ContestPlayerAllow.fromRecord(ContestPlayerAllow.model.build(Object.assign({
      contest_id: 0,
      user_id: 0
    }, val)));
  }

  static async findInContest(where) {
    return ContestPlayerAllow.findOne({ where: where });
  }

  async loadRelationships() {
    let Contest = syzoj.model('contest');
    this.user = await User.fromID(this.user_id);
    this.contest = await Contest.fromID(this.contest_id);
  }

  getModel() { return model; }
}

ContestPlayerAllow.model = model;

module.exports = ContestPlayerAllow;
