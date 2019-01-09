require 'byebug'
require_relative 'redirect_string'
require_relative 'redirect_regex'

class RedirectMap
  def initialize(filename_301:, filename_307:, existing_filenames:)
    @redirect_filenames = redirect_filenames
    @existing_filenames = existing_filenames

    populate_maps(filename_301: filename_301,
                  filename_307: filename_307)
  end

  def find(data:)
    if data.is_a?(String)
      find_redirect(link: data)
    elsif data.is_a?(Array)
      link_redirects = []
      not_found = []

      data.each do |link|
        next if file_exists_for?(link: link)
        redirect = find_redirect(link: link)
        if redirect
          link_redirects << redirect 
        else
          not_found << link
        end
      end

      [link_redirects, not_found]
    else
      raise "RedirectMap#find only accepts a string or array of strings"
    end
  end

  private

  attr_reader :redirect_filenames,
              :redirects_301,
              :redirects_307,
              :existing_filenames

  def file_exists_for?(link:)
    existing_filenames.file_exists_for?(link: link)
  end

  def find_redirect(link:)
    # This is much more complicated than just replacing.
    # If the link is latest, it should be updated but still
    # contain latest. A little more involved than a simple
    # replace
    # corrected_link = replace_307_redirect(link: link)

    find_301_redirect(link: link)
  end

  # Returns corrected link if 307 found, else returns original
  def replace_307_redirect(link:)
    redirects_307.each do |redirect|
      if redirect.match?(link: link)
        return redirect.replace(content: link)
      end
    end
    
    link
  end

  # Returns redirect if found, else returns nil
  def find_301_redirect(link:)
    redirects_301.each do |redirect|
      if redirect.match?(link: link)
        return redirect
      end
    end
    
    nil
  end

  def populate_maps(filename_301:, filename_307:)
    populate_map(name: "redirects_301",
                 filename: filename_301)
    populate_map(name: "redirects_307",
                 filename: filename_307)
  end

  def populate_map(name:, filename:)
    redirects = File.readlines(filename).map do |line|
      pre_link, post_link = line.split(' ')

      # Remove the semicolon
      formatted_post_link = post_link[0..-2]

      if pre_link.start_with?('~')
        RedirectRegex.new(
          pre: pre_link[1..-1],
          post: formatted_post_link
        )
      else
        RedirectString.new(
          pre: pre_link,
          post: formatted_post_link
        )
      end
    end
    instance_variable_set("@#{name}", redirects)
  end
end
