require_relative 'redirect'

class RedirectRegex < Redirect
  def match?(url:)
    pre_regex.match(url)
  end
  
  def follow_redirect(link:)
    raise "Not a match" unless match?(url: link.url)

    Link.new(url: link.url.gsub(pre_regex, post))
  end

  private

  def post
    @post.gsub('$', '\\')
  end

  def pre_regex
    Regexp.new(pre)
  end
end
