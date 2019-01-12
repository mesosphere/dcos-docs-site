require_relative 'redirect'

class RedirectRegex < Redirect
  def match?(url:)
    prep_regex(regex: pre).match(url)
  end
  
  def follow_redirect(link:)
    raise "Not a match" unless match?(url: link.url)

    Link.new(url: link.url.gsub(
      prep_regex(regex: pre),
      prep_post(post: post)
    ))
  end

  def unfollow_redirect(link:)
    reverse_pre = "^" + post.gsub("$1", "(.*)$")
    reverse_post = pre.gsub("(.*)$", "$1")
    if reverse_post.start_with?("^")
      reverse_post = reverse_post[1..-1]
    end

    Link.new(url: link.url.gsub(
      prep_regex(regex: reverse_pre),
      prep_post(post: reverse_post)
    ))
  end

  private

  def prep_post(post:)
    post.gsub('$', '\\')
  end

  def prep_regex(regex:)
    Regexp.new(regex)
  end
end
