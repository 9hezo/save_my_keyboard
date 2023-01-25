'use strict';

class TokensRepository {
  constructor(tokensModel) {
    this.tokensModel = tokensModel;
  }

  saveToken = async (refreshToken, userId) => {
    return await this.tokensModel.create({ refreshToken, userId });
  };

  findOneToken = async (refreshToken) => {
    return await this.tokensModel.findOne({ where: { refreshToken } });
  };
}

module.exports = TokensRepository;
