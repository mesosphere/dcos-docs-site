class Redirect
  def initialize(pre:, post:)
    @pre = pre
    @post = post
  end

  private

  attr_reader :post, :pre
end
