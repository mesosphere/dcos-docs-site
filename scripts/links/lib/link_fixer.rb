require_relative 'link'

class LinkFixer
  attr_reader :link
  attr_accessor :redirect_307, :redirect_301

  def initialize(link:)
    @link = link
  end

  def replace(content:)
    if has_redirect_307?
      replace_with_307(content: content)
    else
      replace_without_307(content: content)
    end
  end

  def replace_with_307(content:)
    content = replace_redirect(
      content: content,
      redirect: redirect_307,
      link: link
    )

    content = replace_redirect(
      content: content,
      redirect: redirect_301,
      link: redirect_307_link(link: link)
    )

    content = unreplace_307(
      content: content
    )

    content
  end

  def replace_without_307(content:)
    replace_redirect(
      content: content,
      redirect: redirect_301,
      link: link
    )
  end

  def unreplace_307(content:)
    # Find the final conversion of:
    # initial -> 307 corrected -> 301 corrected
    redirect_301_link = redirect_301.follow_redirect(link: redirect_307_link)

    corrected_301_link = redirect_307.unfollow_redirect(
      link: redirect_301_link
    )

    # Take the completed 301 link and replace it with the unconverted 307
    content.gsub(
      redirect_301_link.regex(type: :inline),
      corrected_301_link.replacement(type: :inline)
    )
  end

  def redirect_307_link(link:)
    redirect_307.follow_redirect(link: link)
  end

  def has_redirect_307?
    !!redirect_307
  end

  def has_redirect_301?
    !!redirect_301
  end

  private

  def replace_redirect(content:, redirect:, link:)
    # Can't just replace link with redirected link or it will include other
    # links that include that link in its path
    redirected_link = redirect.follow_redirect(link: link)

    inline_fixed = content.gsub(
      link.regex(type: :inline),
      redirected_link.replacement(type: :inline)
    )

    inline_fixed.gsub(
      link.regex(type: :reference),
      redirected_link.replacement(type: :reference)
    )
  end
end
