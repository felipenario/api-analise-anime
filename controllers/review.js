let Review = require('../models/review');

module.exports = {
    getAllReviews: (req, res, next) => {
      Review.find().then(reviews => {
          res.status(200).json(reviews)
      }).catch(error => {
          res.status(500).json(error)
      })
    },
    getReviewById: (req,res,next)=>{
        //Buscar Análise por ID
        Review.findOne({
            _id: req.params.id
        }).then(review=>{
            res.status(200).json(review);
        }).catch(error=>{
            res.status(500).json(error);
        })

    },
    getReviewsByAnime: (req,res,next)=>{
        //Buscar analise por anime
        Review.find({
            anime: req.params.anime
        }).then(review=>{
            res.status(200).json(review);
        }).catch(error=>{
            res.status(500).json(error);
        })

    },
    getReviewByUser: (req,res,next)=>{
        //buscar analise por usuario
        Review.find({
            user: req.user.username
        }).then(review=>{
            res.status(200).json(review);
        }).catch(error=>{
            res.status(500).json(error);
        })

    },
    getAnimesByExistingReviews: (req, res, next) => {
        Review.find({}, {
            "_id": 0,
            "anime": 1
        }).then((animes) => {
            res.status(200).json({animes});
        }).catch(error => {
            res.status(500).json(error);
        });
    },
    addReview: (req, res, next)=>{
        //add analise
        let review = new Review({
            anime: req.body.anime,
            description: req.body.description,
            user: req.user.username
        })
        review.save().then(review=>{
            res.status(200).json({
                msg: 'Análise cadastrada com sucesso!',
                review: review
            });
        }).catch(error=>{
            res.status(500).json({
                msg: 'Erro ao cadastrar',
                error: error
            })
        })

    },
    editReview: (req, res, next)=>{
        //editar analise
        Review.updateOne(
            {_id: req.params.id},
            {anime: req.body.anime, description: req.body.description,
            user: req.body.user}
            ).then(review=>{
                res.status(200).json({msg: 'Análise editada com sucesso!'});
            }).catch(error=>{
                res.status(500).json(error)
            })
    },
    deleteReview: (req, res, next)=>{
        //deletar analise
        Review.deleteOne({
            _id: req.params.id
        }).then(()=>{
           res.status(200).json({msg: "Análise deletada com sucesso!"});
        }).catch(error=>{
            res.status(500).json(error);
        })
    }
}
