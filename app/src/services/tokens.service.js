'use strict';

const TokensRepository = require('../repositories/tokens.repository');
const { Token } = require('../sequelize/models');

class TokensService {
  tokensRepository = new TokensRepository(Token);

  findOneToken = async (refreshToken) => {
    return await this.tokensRepository.findOneToken(refreshToken);
  };
}

module.exports = TokensService;
