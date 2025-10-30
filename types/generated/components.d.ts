import type { Schema, Struct } from '@strapi/strapi';

export interface CricketAchievement extends Struct.ComponentSchema {
  collectionName: 'components_cricket_achievements';
  info: {
    description: 'Player achievements and awards';
    displayName: 'Achievement';
  };
  attributes: {
    achievedDate: Schema.Attribute.Date;
    badge: Schema.Attribute.Media<'images'>;
    category: Schema.Attribute.Enumeration<
      ['batting', 'bowling', 'fielding', 'team', 'tournament', 'milestone']
    > &
      Schema.Attribute.DefaultTo<'milestone'>;
    description: Schema.Attribute.Text;
    points: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CricketInnings extends Struct.ComponentSchema {
  collectionName: 'components_cricket_innings';
  info: {
    description: 'Cricket innings details';
    displayName: 'Innings';
  };
  attributes: {
    battingStats: Schema.Attribute.JSON;
    bowlingStats: Schema.Attribute.JSON;
    extras: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    fallOfWickets: Schema.Attribute.JSON;
    partnerships: Schema.Attribute.JSON;
    runRate: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    totalOvers: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    totalRuns: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    totalWickets: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface CricketPlayerStats extends Struct.ComponentSchema {
  collectionName: 'components_cricket_player_stats';
  info: {
    description: 'Cricket player statistics';
    displayName: 'Player Stats';
  };
  attributes: {
    average: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    bestBowling: Schema.Attribute.String;
    bowlingAverage: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    catches: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    centuries: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    economyRate: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    halfCenturies: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    highestScore: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    matchesPlayed: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    runOuts: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    runsScored: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    strikeRate: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    stumpings: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    wicketsTaken: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface CricketTeamStats extends Struct.ComponentSchema {
  collectionName: 'components_cricket_team_stats';
  info: {
    description: 'Team performance statistics';
    displayName: 'Team Stats';
  };
  attributes: {
    highestScore: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    lowestScore: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    matchesDrawn: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    matchesLost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    matchesPlayed: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    matchesWon: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    totalRuns: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    totalWickets: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    tournamentsWon: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    winPercentage: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
  };
}

export interface PollPollOption extends Struct.ComponentSchema {
  collectionName: 'components_poll_poll_options';
  info: {
    description: 'Individual poll option with text and vote count';
    displayName: 'poll-option';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
    voteCount: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'cricket.achievement': CricketAchievement;
      'cricket.innings': CricketInnings;
      'cricket.player-stats': CricketPlayerStats;
      'cricket.team-stats': CricketTeamStats;
      'poll.poll-option': PollPollOption;
    }
  }
}
