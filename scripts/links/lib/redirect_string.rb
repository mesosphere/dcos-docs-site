require_relative 'redirect'
require_relative 'link'

class RedirectString < Redirect
  def match?(url:)
    url == pre
  end

  def follow_redirect(link:)
    raise "Not a match" unless match?(url: link.url)
    Link.new(url: post)
  end
end
