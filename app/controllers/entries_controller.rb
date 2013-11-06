class EntriesController < ApplicationController
  respond_to :json

  def index
    @root = Entry.find(1)
    render json: @root
  end

  def show
    @entry = Entry.find(params[:id])
    render json: @entry
  end

  # def create
  #   @entry = Entry.create(params[:entry])
  #   render json: @entry
  # end

end
