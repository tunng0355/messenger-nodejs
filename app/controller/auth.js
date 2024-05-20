import library from "../library/function.js";
import User from "../model/User.js";

import jwt from "jsonwebtoken";

class AuthController {
  static async DangNhap(req, res) {
    try {
      const { account, password } = req.body;

      const users1 = await User.findOne({ email: account });
      const users2 = await User.findOne({ username: account });
      const users3 = await User.findOne({ phone: account });

      let acc = false;
      let user;

      if (users1) {
        acc = true;
        user = users1;
      } else if (users2) {
        acc = true;
        user = users2;
      } else if (users3) {
        acc = true;
        user = users3;
      }

      if (library.empty(account)) {
        return res.status(400).json({
          code: 400,
          message: "Tài khoản không được bỏ trống",
        });
      } else if (!acc) {
        return res.status(401).json({
          code: 401,
          message: "Tài khoản không tồn tại trong hệ thống",
        });
      } else if (library.empty(password)) {
        return res.status(400).json({
          code: 400,
          message: "Mật khẩu không được bỏ trống",
        });
      } else if (user.password !== password) {
        return res.status(400).json({
          code: 400,
          message: "Mật khẩu tài khoản không chính xác",
        });
      } else {
        const token = await jwt.sign(
          { username: user.username },
          process.env.ACCESS_TOKEN_SECRET,
          { algorithm: "HS256", expiresIn: "365d" }
        );

        await User.updateOne(
          { username: user.username },
          { $set: { token: token } }
        );

        res.cookie("access_token", token);

        return res.status(200).json({
          code: 200,
          message: "Đăng nhập thành công",
          href: "/",
        });
      }
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: "Có lỗi gì xảy ra",
        errorlog: error,
      });
    }
  }

  static async DangKy(req, res) {
    try {
      const {
        fullname,
        username,
        email,
        password,
        DateBirth,
        MonthBirth,
        YearBirth,
      } = req.body;

      const avatar = `https://ui-avatars.com/api/?name=${username}&size=128&background=random`;

      const users1 = await User.findOne({ email: email });
      const users2 = await User.findOne({ username: username });
      
      if (library.empty(fullname)) {
        return res.status(400).json({
          code: 400,
          message: "Họ và tên không được bỏ trống",
        });
      } else if (library.empty(email)) {
        return res.status(400).json({
          code: 400,
          message: "Email không được bỏ trống",
        });
      } else if (users1) {
        return res.status(401).json({
          code: 401,
          message: "Email đã tồn tại trong hệ thống",
        });
      } else if (library.empty(username)) {
        return res.status(400).json({
          code: 400,
          message: "Tên đăng nhập không được bỏ trống",
        });
      } else if (users2) {
        return res.status(401).json({
          code: 401,
          message: "Tên đăng nhập đã tồn tại trong hệ thống",
        });
      } else if (library.empty(password)) {
        return res.status(400).json({
          code: 400,
          message: "Mật khẩu không được bỏ trống",
        });
      } else if (library.empty(DateBirth)) {
        return res.status(400).json({
          code: 400,
          message: "Ngày sinh không được bỏ trống",
        });
      } else if (library.empty(MonthBirth)) {
        return res.status(400).json({
          code: 400,
          message: "Tháng sinh không được bỏ trống",
        });
      } else if (library.empty(YearBirth)) {
        return res.status(400).json({
          code: 400,
          message: "Năm sinh không được bỏ trống",
        });
      } else {
        const token = await jwt.sign(
          { username: username },
          process.env.ACCESS_TOKEN_SECRET,
          { algorithm: "HS256", expiresIn: "365d" }
        );

        const user = new User({
          avatar: avatar,
          fullname: fullname,
          username: username,
          email: email,
          DateBirth: DateBirth,
          MonthBirth: MonthBirth,
          YearBirth: YearBirth,
          password: password,
          token: token,
        });

        await user.save();

        res.cookie("access_token", token);

        return res.status(200).json({
          code: 200,
          message: "Đăng ký tài khoản thành công, vui lòng đến bước tiếp theo",
          href: "/",
        });
      }
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: "Có lỗi gì xảy ra",
        errorlog: error,
      });
    }
  }
}

export default AuthController;
