class RedirectFixer
  attr_accessor :redirect_307, :redirect_301

  def initialize(link:)
    @link = link
  end

  def replace(content:)
    content = replace_301(content: content)
    
    ## TODO: inverse 307 change
    #[redirect_301].each do |redirect|
      #next unless redirect
      #replace_inline(redirect: redirect)
      #replace_reference(redirect: redirect)
    #end

    content
  end

  def has_redirect_307?
    !!redirect_307
  end

  def has_redirect_301?
    !!redirect_301
  end

  private

  def replace_301(content:)
    content.gsub(
      link,
      redirect_301.follow_redirect(link: link)
    )
  end

  #def replace_inline(redirect:)
    #self.content = content.gsub(
      #inline_pre_regex(redirect: redirect),
      #inline_post_regex(redirect: redirect),
    #)
  #end

  #def replace_reference(redirect:)
    #self.content = content.gsub(
      #reference_pre_regex(redirect: redirect),
      #reference_post_regex(redirect: redirect),
    #)
  #end

  #def inline_pre_regex(redirect:)
    #Regexp.new("\\[(.*)\\]\\(#{redirect.pre}\\)")
  #end

  #def inline_post_regex(redirect:)
    #post = redirect.post
    #post = post.gsub('\\\1', '\\\2')
    #redirect.post(link: link)
    #"[\\1](#{post})"
  #end

  #def reference_pre_regex(redirect:)
    #Regexp.new("\\[(.*)\\]\\(#{redirect.pre}\\)")
  #end

  #def reference_post_regex(redirect:)
    #post = redirect.post
    #post = post.gsub('\\\1', '\\\2')
    #redirect.post(link: link)
    #"[\\1](#{post})"
  #end

  attr_reader :link
  attr_accessor :content
end
