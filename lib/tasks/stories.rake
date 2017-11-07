namespace :stories do
  desc 'Import new stories from WRI RSS feed'
  task import: :environment do
    puts '##############################'
    puts '# Starting to import stories #'
    puts '##############################'
    ImportStories.new.call
    puts '########### ENDED ############'
  end

  desc 'Delete stories and re-import'
  task fresh_import: :environment do
    puts '##############################'
    puts '# Starting to import stories #'
    puts '##############################'
    ImportStories.new.call(true)
    puts '########### ENDED ############'
  end
end