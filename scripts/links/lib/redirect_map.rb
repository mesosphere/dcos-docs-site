require 'byebug'
require_relative 'redirect_string'
require_relative 'redirect_regex'
require_relative 'link_fixer'

class RedirectMap
  def initialize(filename_301:, filename_307:, existing_filenames:)
    @existing_filenames = existing_filenames

    populate_map(
      name: "redirects_301",
      filename: filename_301
    )
    populate_map(
      name: "redirects_307",
      filename: filename_307
    )
  end

  def find_fixers(links:)
    redirect_fixers = []
    not_found = []

    links.each do |link|
      next if file_exists_for?(link: link)
      fixer = find_fixer(link: link)
      if fixer.has_redirect_307? && !fixer.has_redirect_301?
        redirected_link = fixer.redirect_307_link(link: link)
        next if file_exists_for?(link: redirected_link)
      end

      if fixer.has_redirect_301?
        redirect_fixers << fixer
      else
        not_found << link
      end
    end

    [redirect_fixers, not_found]
  end

  def find_fixer(link:)
    fixer = LinkFixer.new(link: link)
    return fixer if link.url.start_with?("#", "http", ".")

    fixer.redirect_307 = find_307_redirect(link: link)

    if fixer.has_redirect_307?
      redirected_link = fixer.redirect_307.follow_redirect(link: link)
      fixer.redirect_301 = find_301_redirect(link: redirected_link)
    else
      fixer.redirect_301 = find_301_redirect(link: link)
    end

    fixer
  end


  private

  attr_reader :redirects_301,
              :redirects_307,
              :existing_filenames

  def file_exists_for?(link:)
    existing_filenames.file_exists_for?(url: link.url)
  end

  def find_307_redirect(link:)
    find_redirect(redirects: redirects_307, link: link)
  end

  def find_301_redirect(link:)
    find_redirect(redirects: redirects_301, link: link)
  end

  def find_redirect(redirects:, link:)
    redirects.each do |redirect|
      if redirect.match?(url: link.url)
        return redirect
      end
    end
    
    nil
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
