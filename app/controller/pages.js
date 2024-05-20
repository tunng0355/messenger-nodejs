import jwt from 'jsonwebtoken';
import User from '../model/User.js';

class HomeController {
  static async TrangChu(req, res, next) {
    try {
      return res.render('home/index', {
        users: req.user
      });
    } catch (error) {
      next(error);
    }
  }

  static async Chat(req, res, next) {
    try {
      return res.render('home/index', {
        users: req.user
      });
    } catch (error) {
      next(error);
    }
  }

  static async DangNhap(req, res, next) {
    try {
      return res.render('auth/login');
    } catch (error) {
      next(error);
    }
  }

  static async DangKy(req, res, next) {
    try {
      return res.render('auth/register');
    } catch (error) {
      next(error);
    }
  }
}

export default HomeController;
