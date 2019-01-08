require 'byebug'
require_relative 'redirect_string'
require_relative 'redirect_regex'

class RedirectMap
  def initialize(redirect_filename:, existing_filenames:)
    @redirect_filename = redirect_filename
    @redirects = populate_map(redirect_filename)
    @existing_filenames = existing_filenames
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

  attr_reader :redirects, :existing_filenames

  def file_exists_for?(link:)
    existing_filenames.file_exists_for?(link: link)
  end

  def find_redirect(link:)
    redirects.each do |redirect|
      if redirect.match?(link: link)
        return redirect
      end
    end
    
    nil
  end

  def populate_map(filename)
    File.readlines(filename).map do |line|
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
  end
end
