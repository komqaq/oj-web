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

let User = syzoj.model('user');
let Team = syzoj.model('team');
/*
//to do
app.get('/find_team', async (req, res) => {
  try {
    if (!res.locals.user) throw new ErrorMessage('请先登陆哦(´∀ `)', { '登录': syzoj.utils.makeUrl(['login'], { 'url': req.originalUrl }) });
    let user = await Team.fromName(req.query.nickname);
    if (!user) throw new ErrorMessage('无此用户。');
    res.redirect(syzoj.utils.makeUrl(['user', user.id]));
  } catch (e) {
    syzoj.log(e);
    res.render('error', {
      err: e
    });
  }
});*/

// Team page
app.get('/team/:id', async (req, res) => {
  try {
    if (!res.locals.user) throw new ErrorMessage('请先登陆哦(´∀ `)', { '登录': syzoj.utils.makeUrl(['login'], { 'url': req.originalUrl }) });
    let id = parseInt(req.params.id);
    let team = await Team.fromID(id);
    if (!team || team.id == 1) throw new ErrorMessage('无此团队。');

    let users = [], admins = [];
    if (team.users) users = await team.users.split('|').mapAsync(async id => await User.fromID(id));
    if (team.admins) admins = await team.admins.split('|').mapAsync(async id => await User.fromID(id));

    res.render('team', {
      team: team,
      users: users,
      admins: admins
    });
  } catch (e) {
    syzoj.log(e);
    res.render('error', {
      err: e
    });
  }
});

app.get('/team/:id/edit', async (req, res) => {
  try {
    if (!res.locals.user) throw new ErrorMessage('请先登陆哦(´∀ `)', { '登录': syzoj.utils.makeUrl(['login'], { 'url': req.originalUrl }) });
    let id = parseInt(req.params.id);
    let team = await Team.fromID(id);
    if (!team) throw new ErrorMessage('无此团队。');

    let allowedEdit = await res.locals.user.isAllowedEditByTeam(res.locals.user);
    if (!allowedEdit || team.id == 1) {
      throw new ErrorMessage('您没有权限进行此操作。');
    }

    let users = [], admins = [];
    if (team.users) users = await team.users.split('|').mapAsync(async id => await User.fromID(id));
    if (team.admins) admins = await team.admins.split('|').mapAsync(async id => await User.fromID(id));

    res.render('team_edit', {
      team: team,
      users: users,
      admins: admins
    });
  } catch (e) {
    syzoj.log(e);
    res.render('error', {
      err: e
    });
  }
});

async function change(users, users2, admins2, id, is_admin) {
  for (let user of users) {
    var x = 0;

    for (let u2 of users2) {
      if (user.id == u2.id) x = 1;
    }
    for (let u2 of admins2) {
      if (user.id == u2.id) x = 1;
    }

    if (x == 0) {
      user.team = 1;
      user.team_admin = false;
      await user.save();
    }
  }

  for (let user of users2) {
    user.team = id;
    user.team_admin = is_admin;
    await user.save();
  }
}

app.post('/team/:id/edit', async (req, res) => {
  try {
    if (!res.locals.user) throw new ErrorMessage('请先登陆哦(´∀ `)', { '登录': syzoj.utils.makeUrl(['login'], { 'url': req.originalUrl }) });
    let id = parseInt(req.params.id);
    let team = await Team.fromID(id);
    if (!team) throw new ErrorMessage('无此团队。');

    let allowedEdit = await res.locals.user.isAllowedEditByTeam(res.locals.user);
    if (!allowedEdit || team.id == 1) throw new ErrorMessage('您没有权限进行此操作。');

    if (!req.body.name.trim()) throw new ErrorMessage('团队名不能为空。');
    team.name = req.body.name;

    let users = [], admins = [], users2 = [], admins2 = [];
    if (team.users) users = await team.users.split('|').mapAsync(async id => await User.fromID(id));
    if (team.admins) admins = await team.admins.split('|').mapAsync(async id => await User.fromID(id));

    if (!Array.isArray(req.body.users)) req.body.users = [req.body.users];
    team.users = await req.body.users.join('|');

    if (!Array.isArray(req.body.admins)) req.body.admins = [req.body.admins];
    team.admins = await req.body.admins.join('|');

    if (team.users) users2 = await team.users.split('|').mapAsync(async id => await User.fromID(id));
    if (team.admins) admins2 = await team.admins.split('|').mapAsync(async id => await User.fromID(id));

    for (let user of users2) {
      for (let user2 of admins2) {
        if (user.id == user2.id) throw new ErrorMessage('用户重复。');
      }
    }
    await change(users, users2, admins2, id, false);
    await change(admins, admins2, users2, id, true);

    await team.save();

    res.redirect(syzoj.utils.makeUrl(['team', team.id]));
  } catch (e) {
    syzoj.log(e);
    res.render('error', {
      err: e
    });
  }
});
