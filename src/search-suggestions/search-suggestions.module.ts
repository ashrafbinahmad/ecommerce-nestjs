import { Module } from '@nestjs/common';
import { SearchSuggestionsService } from './search-suggestions.service';
import { SearchSuggestionsController } from './search-suggestions.controller';

@Module({
  controllers: [SearchSuggestionsController],
  providers: [SearchSuggestionsService],
})
export class SearchSuggestionsModule {}
