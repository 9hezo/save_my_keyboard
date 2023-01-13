'use strict';

class TokensRepository {
  constructor(tokensModel) {
    this.tokensModel = tokensModel;
  }

  saveToken = async (refreshToken, userId) => {
    try {
      const result = await this.tokensModel.create({ refreshToken, userId });
      return result.id;
    } catch (err) {
      console.log(err);
      return -1;
    }
  };

  findOneToken = async (refreshToken) => {
    try {
      return await this.tokensModel.findOne({ where: { refreshToken } });
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = TokensRepository;
