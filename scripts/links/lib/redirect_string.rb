require_relative 'redirect'

class RedirectString < Redirect
  def match?(link:)
    link == pre
  end

  def follow_redirect(link:)
    raise "Not a match" unless match?(link: link)
    post
  end
end
